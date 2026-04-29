#!/usr/bin/env python3
"""
Daisycon API Client — affiliate tracking URLs, productfeeds, transactions.

Publisher ID : 41aslimzo
Media ID     : 420541

Setup:
    export DAISYCON_USERNAME=your_email@example.com
    export DAISYCON_PASSWORD=your_password
    python3 daisycon_client.py [command]

Commands:
    programs          — List active programs/campaigns
    tracking <program_id> <target_url>
                      — Generate tracking URL for a program
    transactions [days]
                      — Fetch recent transactions (default 30 days)
    feed <program_id> — Fetch productfeed for a program
    test              — Test auth + list programs

Energy campaigns (first batch):
    Vattenfall, Essent, Vandebron, Innova, Pricewise
"""
import os
import sys
import json
import time
import urllib.parse
import requests
from datetime import datetime, timedelta

# ─── Config ────────────────────────────────────────────────────────────────────
PUBLISHER_ID = "41aslimzo"
MEDIA_ID     = "420541"
BASE_URL     = "https://services.daisycon.com"
CLICK_URL    = "https://click.daisycon.com"

USERNAME = os.environ.get("DAISYCON_USERNAME", "")
PASSWORD = os.environ.get("DAISYCON_PASSWORD", "")

# Token cache (in-memory for this run)
_token_cache = {"token": None, "expires_at": 0}


# ─── Auth ──────────────────────────────────────────────────────────────────────
def get_token() -> str:
    """Obtain OAuth2 bearer token via password grant, with in-memory caching."""
    if not USERNAME or not PASSWORD:
        raise EnvironmentError(
            "Set DAISYCON_USERNAME and DAISYCON_PASSWORD env vars.\n"
            "Get credentials at https://app.daisycon.com"
        )
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]

    resp = requests.post(
        f"{BASE_URL}/auth/token",
        json={
            "grant_type": "password",
            "username": USERNAME,
            "password": PASSWORD,
        },
        timeout=10,
    )
    if resp.status_code == 401:
        raise PermissionError("Daisycon auth failed — check DAISYCON_USERNAME / DAISYCON_PASSWORD")
    resp.raise_for_status()
    data = resp.json()

    _token_cache["token"] = data["access_token"]
    _token_cache["expires_at"] = now + data.get("expires_in", 3600) - 60
    return _token_cache["token"]


def _headers() -> dict:
    return {"Authorization": f"Bearer {get_token()}", "Accept": "application/json"}


# ─── Programs ──────────────────────────────────────────────────────────────────
def get_programs(status: str = "active") -> list[dict]:
    """Return list of programs the publisher is enrolled in."""
    resp = requests.get(
        f"{BASE_URL}/publishers/{PUBLISHER_ID}/programs",
        headers=_headers(),
        params={"status": status, "per_page": 200},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("_embedded", {}).get("programs", resp.json())


def find_program(name_fragment: str) -> dict | None:
    """Find a program by name fragment (case-insensitive)."""
    programs = get_programs()
    name_lower = name_fragment.lower()
    for p in programs:
        if name_lower in p.get("name", "").lower():
            return p
    return None


# ─── Tracking URLs ─────────────────────────────────────────────────────────────
def make_tracking_url(
    program_id: str,
    target_url: str,
    sub_id: str | None = None,
) -> str:
    """
    Generate a Daisycon click-tracking URL.

    Format: https://click.daisycon.com/tc/{publisherId}/{mediaId}/{programId}/
            ?url={encodedTargetUrl}[&subid={subId}]

    Args:
        program_id : Daisycon program/campaign ID
        target_url : The destination URL (merchant page)
        sub_id     : Optional sub-tracking ID (e.g. page slug for attribution)
    """
    encoded = urllib.parse.quote(target_url, safe="")
    url = f"{CLICK_URL}/tc/{PUBLISHER_ID}/{MEDIA_ID}/{program_id}/?url={encoded}"
    if sub_id:
        url += f"&subid={urllib.parse.quote(str(sub_id))}"
    return url


def make_tracking_url_by_name(
    program_name: str,
    target_url: str,
    sub_id: str | None = None,
) -> str:
    """Convenience: look up program by name fragment then generate tracking URL."""
    program = find_program(program_name)
    if not program:
        raise ValueError(f"No active program found matching '{program_name}'")
    program_id = str(program["id"])
    url = make_tracking_url(program_id, target_url, sub_id)
    return url


# ─── Product Feeds ─────────────────────────────────────────────────────────────
def get_feeds(program_id: str) -> list[dict]:
    """Fetch product feed metadata for a program."""
    resp = requests.get(
        f"{BASE_URL}/publishers/{PUBLISHER_ID}/programs/{program_id}/feeds",
        headers=_headers(),
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("_embedded", {}).get("feeds", resp.json())


def fetch_feed_items(feed_url: str, limit: int = 50) -> list[dict]:
    """
    Fetch items from a productfeed URL (typically CSV or XML).
    Returns first `limit` items as dicts.
    """
    import csv, io
    resp = requests.get(feed_url, timeout=30)
    resp.raise_for_status()
    content_type = resp.headers.get("Content-Type", "")
    if "csv" in content_type or feed_url.endswith(".csv"):
        reader = csv.DictReader(io.StringIO(resp.text))
        return [row for _, row in zip(range(limit), reader)]
    # Fallback: return raw text
    return [{"raw": resp.text[:2000]}]


# ─── Transactions ──────────────────────────────────────────────────────────────
def get_transactions(days: int = 30) -> list[dict]:
    """Fetch transactions for the last N days."""
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    resp = requests.get(
        f"{BASE_URL}/publishers/{PUBLISHER_ID}/transactions",
        headers=_headers(),
        params={
            "media[]": MEDIA_ID,
            "start_date": since,
            "per_page": 200,
        },
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json().get("_embedded", {}).get("transactions", resp.json())


# ─── CLI ───────────────────────────────────────────────────────────────────────
def cmd_programs(_args: list[str]) -> None:
    programs = get_programs()
    print(f"{'ID':<12} {'Name':<35} {'Status':<12} {'Commission'}")
    print("-" * 75)
    for p in programs:
        print(
            f"{p.get('id','?'):<12} "
            f"{p.get('name','?')[:34]:<35} "
            f"{p.get('status','?'):<12} "
            f"{p.get('commission','?')}"
        )
    print(f"\nTotal: {len(programs)} programs")


def cmd_tracking(args: list[str]) -> None:
    if len(args) < 2:
        print("Usage: tracking <program_id_or_name> <target_url> [sub_id]")
        sys.exit(1)
    program_ref, target_url = args[0], args[1]
    sub_id = args[2] if len(args) > 2 else None

    # Numeric ID → use directly, else name lookup
    if program_ref.isdigit():
        url = make_tracking_url(program_ref, target_url, sub_id)
    else:
        url = make_tracking_url_by_name(program_ref, target_url, sub_id)
    print(url)


def cmd_transactions(args: list[str]) -> None:
    days = int(args[0]) if args else 30
    txns = get_transactions(days)
    total_commission = sum(float(t.get("commission", 0)) for t in txns)
    print(f"Transactions last {days} days: {len(txns)}")
    print(f"Total commission: €{total_commission:.2f}")
    print()
    for t in txns[:20]:
        print(
            f"  {t.get('transaction_date','?')[:10]}  "
            f"{t.get('program_name','?')[:30]:<32} "
            f"€{float(t.get('commission',0)):.2f}  "
            f"{t.get('status','?')}"
        )


def cmd_feed(args: list[str]) -> None:
    if not args:
        print("Usage: feed <program_id>")
        sys.exit(1)
    program_id = args[0]
    feeds = get_feeds(program_id)
    if not feeds:
        print(f"No feeds for program {program_id}")
        return
    print(f"Feeds for program {program_id}:")
    for f in feeds:
        print(f"  {f.get('name','?')} — {f.get('url','?')}")
    # Fetch items from first feed
    if feeds[0].get("url"):
        print(f"\nFirst 10 items from '{feeds[0]['name']}':")
        items = fetch_feed_items(feeds[0]["url"], limit=10)
        for item in items:
            print(f"  {json.dumps(item, ensure_ascii=False)[:120]}")


def cmd_test(_args: list[str]) -> None:
    print("Testing Daisycon API connection...")
    token = get_token()
    print(f"  Auth OK — token starts with: {token[:12]}...")
    programs = get_programs()
    print(f"  Programs: {len(programs)} found")
    # Show energy-related ones
    energy_keywords = ["vattenfall", "essent", "vandebron", "innova", "pricewise", "energie"]
    energy_programs = [
        p for p in programs
        if any(k in p.get("name", "").lower() for k in energy_keywords)
    ]
    print(f"  Energy campaigns: {len(energy_programs)}")
    for p in energy_programs:
        print(f"    [{p['id']}] {p['name']} — {p.get('commission','?')}")

    # Show example tracking URL for first energy program
    if energy_programs:
        ex = energy_programs[0]
        ex_url = make_tracking_url(str(ex["id"]), "https://slimzonnig.nl/energie/vattenfall")
        print(f"\n  Example tracking URL ({ex['name']}):")
        print(f"    {ex_url}")
    print("\nAll tests passed.")


COMMANDS = {
    "programs":     cmd_programs,
    "tracking":     cmd_tracking,
    "transactions": cmd_transactions,
    "feed":         cmd_feed,
    "test":         cmd_test,
}


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print("Usage: daisycon_client.py <command> [args...]")
        print(f"Commands: {', '.join(COMMANDS)}")
        print(__doc__)
        return 1
    cmd = sys.argv[1]
    try:
        COMMANDS[cmd](sys.argv[2:])
    except EnvironmentError as e:
        print(f"CONFIG ERROR: {e}", file=sys.stderr)
        return 1
    except requests.HTTPError as e:
        print(f"API ERROR: {e}\nResponse: {e.response.text[:400]}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
