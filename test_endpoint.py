#!/usr/bin/env python
import requests
import json
import time
import sys

# Give server a moment to start
time.sleep(3)

# Test arbitrage endpoint
url = "http://127.0.0.1:8001/odds?sport=soccer_epl&region=us&market=h2h"
try:
    print(f"Fetching from {url}")
    odds_response = requests.get(url, timeout=5)
    odds_response.raise_for_status()
    odds_data = odds_response.json()
    print(f"✓ Got {len(odds_data['events'])} events")
    
    event = odds_data['events'][0]
    print(f"\nTesting /arbitrage with event: {event.get('home_team')} vs {event.get('away_team')}")
    
    payload = {
        "events": [event],
        "stake": 100
    }
    print(f"Payload event keys: {list(event.keys())}")
    print(f"Payload bookmakers: {len(event.get('bookmakers', []))}")
    
    arb_url = "http://127.0.0.1:8001/arbitrage"
    print(f"\nPOSTing to {arb_url}")
    arb_response = requests.post(arb_url, json=payload, timeout=5)
    
    print(f"Status code: {arb_response.status_code}")
    print(f"Response text: {arb_response.text[:500]}")
    
    if arb_response.status_code == 200:
        print("✓ SUCCESS")
        print(json.dumps(arb_response.json(), indent=2, default=str))
    else:
        print(f"✗ FAILED - {arb_response.status_code}")
        
except requests.exceptions.ConnectError as e:
    print(f"✗ Connection error: {e}")
    sys.exit(1)
except Exception as e:
    import traceback
    print(f"✗ Error: {e}")
    traceback.print_exc()
    sys.exit(1)
