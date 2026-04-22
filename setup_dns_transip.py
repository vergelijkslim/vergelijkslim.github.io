#!/usr/bin/env python3
"""
TransIP DNS setup script for 3 domains pointing to GitHub Pages.
"""
import json
import time
import uuid
import base64
import socket
import requests
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# Force IPv4: our whitelisted IP (83.84.250.187) is IPv4 only
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only

# Config
LOGIN = "affilatemarketing1"
PRIVATE_KEY_PATH = "C:/Users/vande/.paperclip/instances/default/companies/308baf3e-b60e-47f5-a06f-c938f1451378/secrets/transip_private_key.pem"
API_URL = "https://api.transip.nl/v6"

DOMAINS = [
    "slimzonnig.nl",
    "vergelijk-uw-thuisbatterij.nl",
    "vergelijk-uw-hosting.nl",
    "vergelijk-uw-renovatie.nl",
    "vergelijk-uw-laadpaal.nl",
]

# GitHub Pages A records + CNAME
DNS_RECORDS = [
    {"name": "@", "type": "A",     "content": "185.199.108.153", "expire": 3600},
    {"name": "@", "type": "A",     "content": "185.199.109.153", "expire": 3600},
    {"name": "@", "type": "A",     "content": "185.199.110.153", "expire": 3600},
    {"name": "@", "type": "A",     "content": "185.199.111.153", "expire": 3600},
    {"name": "www", "type": "CNAME", "content": "vergelijkslim.github.io.", "expire": 3600},
]

GITHUB_REPOS = {
    "slimzonnig.nl":             "vergelijkslim/slimzonnig",
    "vergelijk-uw-thuisbatterij.nl": "vergelijkslim/thuisbatterijwijzer",
    "vergelijk-uw-hosting.nl":  "vergelijkslim/hostingwijzer",
    "vergelijk-uw-renovatie.nl": "vergelijkslim/woningwijzer",
    "vergelijk-uw-laadpaal.nl": "vergelijkslim/laadpaalwijzer",
}


def get_auth_token():
    with open(PRIVATE_KEY_PATH, "rb") as f:
        private_key = serialization.load_pem_private_key(f.read(), password=None)

    nonce = uuid.uuid4().hex[:24]  # 24 hex chars, no dashes
    expiry_time = int(time.time()) + 3600
    global_key = False
    read_only = False

    request_body = json.dumps({
        "login": LOGIN,
        "nonce": nonce,
        "read_only": read_only,
        "expiration_time": "1 hour",
        "label": f"dns-setup-{nonce}",
        "global_key": global_key,
    }, separators=(",", ":"))

    signature = private_key.sign(
        request_body.encode("utf-8"),
        padding.PKCS1v15(),
        hashes.SHA512(),
    )
    sig_b64 = base64.b64encode(signature).decode("utf-8")

    resp = requests.post(
        f"{API_URL}/auth",
        data=request_body,
        headers={
            "Content-Type": "application/json",
            "Signature": sig_b64,
        },
    )
    print(f"Auth response: {resp.status_code} {resp.text}")
    resp.raise_for_status()
    token = resp.json()["token"]
    print(f"Auth token obtained (first 20 chars): {token[:20]}...")
    return token


def get_current_dns(token, domain):
    resp = requests.get(
        f"{API_URL}/domains/{domain}/dns",
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return resp.json().get("dnsEntries", [])


def set_dns_records(token, domain, records):
    """Replace all DNS records for a domain."""
    resp = requests.put(
        f"{API_URL}/domains/{domain}/dns",
        json={"dnsEntries": records},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    if resp.status_code == 204:
        print(f"  [OK] DNS records set for {domain}")
        return True
    else:
        print(f"  [FAIL] HTTP {resp.status_code}")
        print(f"  {resp.text[:400]}")
        return False


def apply_github_pages_dns(token, domain):
    """
    Merge strategy:
    - Keep: MX, TXT (SPF/DMARC), DKIM CNAMEs
    - Remove: old A @ (non-GitHub IPs), AAAA @, old www CNAME
    - Add: GitHub Pages A records + www CNAME -> vergelijkslim.github.io.
    """
    current = get_current_dns(token, domain)
    print(f"\n  Current DNS entries for {domain}:")
    for e in current:
        print(f"    {e.get('type')} {e.get('name')} -> {e.get('content')}")

    github_ips = {r["content"] for r in DNS_RECORDS if r["type"] == "A"}
    kept = []
    for e in current:
        name = e.get("name", "")
        rtype = e.get("type", "")
        content = e.get("content", "")
        if name == "@" and rtype == "A" and content not in github_ips:
            print(f"  [REMOVE] A @ -> {content}")
            continue
        if name == "@" and rtype == "AAAA":
            print(f"  [REMOVE] AAAA @ -> {content}")
            continue
        if name == "www" and rtype == "CNAME":
            print(f"  [REPLACE] CNAME www -> {content}")
            continue
        kept.append(e)

    kept_set = {(e["name"], e["type"], e["content"]) for e in kept}
    for r in DNS_RECORDS:
        key = (r["name"], r["type"], r["content"])
        if key not in kept_set:
            print(f"  [ADD] {r['type']} {r['name']} -> {r['content']}")
            kept.append(r)

    print(f"  Applying {len(kept)} total records...")
    return set_dns_records(token, domain, kept)


def main():
    print("=== TransIP DNS Setup ===\n")
    token = get_auth_token()

    results = {}
    for domain in DOMAINS:
        print(f"\nProcessing {domain}...")
        success = apply_github_pages_dns(token, domain)
        results[domain] = success

    print("\n=== Summary ===")
    all_ok = True
    for domain, ok in results.items():
        status = "OK" if ok else "FAILED"
        print(f"  {domain}: {status}")
        if not ok:
            all_ok = False

    return 0 if all_ok else 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
