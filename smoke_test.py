#!/usr/bin/env python3
"""Smoke tests for Outclass The Odds backend."""

import requests
import json
import time
import sys

BASE_URL = "http://127.0.0.1:8000"
TIMEOUT = 5

def test_health():
    """Test /health endpoint."""
    print("\n=== TEST 1: HEALTH CHECK ===")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        return r.status_code == 200
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_config():
    """Test /config endpoint."""
    print("\n=== TEST 2: CONFIG (API KEY CHECK) ===")
    try:
        r = requests.get(f"{BASE_URL}/config", timeout=TIMEOUT)
        print(f"Status: {r.status_code}")
        resp = r.json()
        print(f"Response: {json.dumps(resp, indent=2)}")
        return r.status_code == 200
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_odds():
    """Test /odds endpoint and return first event."""
    print("\n=== TEST 3: FETCH ODDS ===")
    try:
        r = requests.get(f"{BASE_URL}/odds?sport=soccer_epl&region=us&market=h2h", timeout=TIMEOUT)
        print(f"Status: {r.status_code}")
        resp = r.json()
        events = resp.get("events", [])
        print(f"Got {len(events)} events")
        if events:
            first = events[0]
            print(f"First event ID: {first.get('id')}, Teams: {first.get('home_team')} vs {first.get('away_team')}")
            print(f"Bookmakers: {len(first.get('bookmakers', []))}")
        return r.status_code == 200, events[0] if events else None
    except Exception as e:
        print(f"FAILED: {e}")
        return False, None

def test_arbitrage_debug(event):
    """Test /arbitrage_debug endpoint."""
    print("\n=== TEST 4: ARBITRAGE DEBUG (payload inspection) ===")
    try:
        payload = {"events": [event], "stake": 100}
        r = requests.post(
            f"{BASE_URL}/arbitrage_debug",
            json=payload,
            timeout=TIMEOUT
        )
        print(f"Status: {r.status_code}")
        resp = r.json()
        print(f"Response: {json.dumps(resp, indent=2)}")
        return r.status_code == 200
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_arbitrage(event):
    """Test /arbitrage endpoint."""
    print("\n=== TEST 5: ARBITRAGE PROCESSING ===")
    try:
        payload = {"events": [event], "stake": 100}
        r = requests.post(
            f"{BASE_URL}/arbitrage",
            json=payload,
            timeout=TIMEOUT
        )
        print(f"Status: {r.status_code}")
        resp = r.json()
        print(f"Response (first 500 chars): {json.dumps(resp, indent=2)[:500]}")
        if "arbitrage_results" in resp:
            results = resp["arbitrage_results"]
            if results:
                first_result = results[0]
                print(f"\nFirst result: event_id={first_result.get('event_id')}, arbitrage={first_result.get('arbitrage')}")
                if first_result.get('arbitrage'):
                    print(f"  Profit: {first_result.get('profit')}, ROI: {first_result.get('roi')}")
                else:
                    print(f"  Reason/Error: {first_result.get('reason') or first_result.get('error')}")
        return r.status_code == 200
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("Starting smoke tests...")
    time.sleep(1)  # Wait for server to be ready
    
    results = {}
    results['health'] = test_health()
    results['config'] = test_config()
    success, event = test_odds()
    results['odds'] = success
    
    if event:
        results['debug'] = test_arbitrage_debug(event)
        results['arbitrage'] = test_arbitrage(event)
    else:
        print("\nSkipping arbitrage tests (no events fetched)")
        results['debug'] = False
        results['arbitrage'] = False
    
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    for name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{name:20} {status}")
    
    all_pass = all(results.values())
    print("="*50)
    if all_pass:
        print("ALL TESTS PASSED ✓")
        sys.exit(0)
    else:
        print("SOME TESTS FAILED ✗")
        sys.exit(1)

if __name__ == "__main__":
    main()
