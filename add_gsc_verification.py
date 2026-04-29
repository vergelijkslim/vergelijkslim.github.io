#!/usr/bin/env python3
"""
Add Google Search Console TXT verification records via TransIP API.

Usage:
  1. Edit VERIFICATION_TOKENS dict below with your tokens.
  2. Run: python3 add_gsc_verification.py

Token format from Google Search Console:
  - Go to Search Console > Add Property > Domain
  - Copy the TXT record value (looks like: google-site-verification=XXXXX)
  - Only paste the part AFTER "google-site-verification="
"""
import json
import time
import uuid
import base64
import socket
import requests
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# Force IPv4 (our whitelisted IP is IPv4 only)
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only

# Config
LOGIN = "affilatemarketing1"
PRIVATE_KEY_PATH = "C:/Users/vande/.paperclip/instances/default/companies/308baf3e-b60e-47f5-a06f-c938f1451378/secrets/transip_private_key.pem"
API_URL = "https://api.transip.nl/v6"

# === FILL IN THESE TOKENS FROM GOOGLE SEARCH CONSOLE ===
# Format: "domain": "google-site-verification=TOKEN_VALUE"
# Get tokens by:
#   1. Go to https://search.google.com/search-console
#   2. Add Property (Domain type)
#   3. Copy the TXT record value shown
VERIFICATION_TOKENS = {
    # Already have TXT records in DNS (just need board to click Verify in GSC):
    "vergelijk-uw-renovatie.nl":     "google-site-verification=SxtoGnEpKqJavY4tTjHnO_GOD_RVbgWnuk2XvxegZp8",
    "vergelijk-uw-laadpaal.nl":      "google-site-verification=OcI2V2XfDzDESDOqIEC_Kbe1BOdFfFppkdVZmvwtVT4",
    "vergelijk-uw-hosting.nl":       "google-site-verification=BofBhnWKn87Da4WoAh0ZnLz73ogd3e8ntezfI09GwX8",
    # Needs token from board (go to GSC > Add property > Domain > copy TXT value):
    "vergelijk-uw-thuisbatterij.nl": None,
    # thuisbatterijwijzer.nl is NOT in TransIP account - needs clarification from board
    # "thuisbatterijwijzer.nl":       None,
}


def get_auth_token():
    with open(PRIVATE_KEY_PATH, "rb") as f:
        private_key = serialization.load_pem_private_key(f.read(), password=None)

    nonce = uuid.uuid4().hex[:24]
    body = json.dumps({
        "login": LOGIN,
        "nonce": nonce,
        "read_only": False,
        "expiration_time": "1 hour",
        "label": f"gsc-verify-{nonce}",
        "global_key": True,
    }, separators=(",", ":"))

    sig = private_key.sign(body.encode(), padding.PKCS1v15(), hashes.SHA512())
    sig_b64 = base64.b64encode(sig).decode()

    resp = requests.post(f"{API_URL}/auth", data=body,
        headers={"Content-Type": "application/json", "Signature": sig_b64})
    resp.raise_for_status()
    return resp.json()["token"]


def get_current_dns(token, domain):
    resp = requests.get(f"{API_URL}/domains/{domain}/dns",
        headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.json().get("dnsEntries", [])


def add_txt_verification(token, domain, verification_value):
    """Add google-site-verification TXT record, keeping all existing records."""
    current = get_current_dns(token, domain)

    # Check if already present
    for e in current:
        if e.get("type") == "TXT" and "google-site-verification" in e.get("content", ""):
            existing = e["content"]
            if existing == verification_value:
                print(f"  [SKIP] TXT record already present: {existing}")
                return True
            else:
                print(f"  [UPDATE] Replacing old verification: {existing}")
                current = [x for x in current if not (
                    x.get("type") == "TXT" and "google-site-verification" in x.get("content", "")
                )]
                break

    # Add the new TXT record
    new_record = {
        "name": "@",
        "type": "TXT",
        "content": verification_value,
        "expire": 3600,
    }
    current.append(new_record)
    print(f"  [ADD] TXT @ -> {verification_value}")

    resp = requests.put(f"{API_URL}/domains/{domain}/dns",
        json={"dnsEntries": current},
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})

    if resp.status_code == 204:
        print(f"  [OK] DNS updated for {domain}")
        return True
    else:
        print(f"  [FAIL] HTTP {resp.status_code}: {resp.text[:400]}")
        return False


def main():
    missing = [d for d, t in VERIFICATION_TOKENS.items() if t is None]
    if missing:
        print("ERROR: Missing verification tokens for:")
        for d in missing:
            print(f"  - {d}")
        print("\nPlease fill in VERIFICATION_TOKENS in this script.")
        return 1

    print("=== Google Search Console DNS Verification ===\n")
    token = get_auth_token()
    print(f"TransIP auth OK\n")

    results = {}
    for domain, verification_value in VERIFICATION_TOKENS.items():
        if not verification_value:
            continue
        print(f"Processing {domain}...")
        ok = add_txt_verification(token, domain, verification_value)
        results[domain] = ok

    print("\n=== Summary ===")
    for domain, ok in results.items():
        print(f"  {domain}: {'OK' if ok else 'FAILED'}")

    return 0 if all(results.values()) else 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
