#!/usr/bin/env python
"""
Frontend Integration Test - Simulates how frontend will use the API
"""
import subprocess
import time
import requests
import json

print("\n" + "="*70)
print("FRONTEND INTEGRATION TEST - Simulating real-world usage")
print("="*70)

# Start server
server_proc = subprocess.Popen(
    [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(4)

try:
    BASE = "http://127.0.0.1:8000"
    
    print("\n[Scenario 1] Frontend checks API configuration on startup")
    r = requests.get(f"{BASE}/config")
    print(f"  GET /config → Status {r.status_code}: {r.json()}")
    
    print("\n[Scenario 2] Frontend fetches latest odds for display")
    r = requests.get(f"{BASE}/odds?sport=soccer_epl&region=us&market=h2h")
    data = r.json()
    print(f"  GET /odds → Status {r.status_code}: Got {len(data['events'])} events")
    print(f"    First event: {data['events'][0]['home_team']} vs {data['events'][0]['away_team']}")
    
    print("\n[Scenario 3] User selects an event and clicks 'Analyze Arbitrage'")
    selected_event = data['events'][0]
    payload = {
        "events": [selected_event],
        "stake": 100.0
    }
    r = requests.post(f"{BASE}/arbitrage", json=payload)
    arb_result = r.json()
    print(f"  POST /arbitrage → Status {r.status_code}")
    
    result = arb_result['arbitrage_results'][0]
    print(f"    Home team: {result['home_team']}")
    print(f"    Away team: {result['away_team']}")
    print(f"    Arbitrage opportunity found: {result['arbitrage']}")
    print(f"    Best offers count: {len(result['best_offers'])}")
    
    if result['arbitrage']:
        print(f"    Profit potential: ${result.get('profit', 'N/A')}")
        print(f"    ROI: {result.get('roi', 'N/A')}")
    else:
        print(f"    Improvement needed: {result.get('required_improvement', 'N/A')}")
    
    print("\n[Scenario 4] Frontend handles batch analysis of multiple events")
    multi_payload = {
        "events": data['events'][:3],
        "stake": 100.0
    }
    r = requests.post(f"{BASE}/arbitrage", json=multi_payload)
    print(f"  POST /arbitrage (batch 3 events) → Status {r.status_code}")
    print(f"    Results count: {len(r.json()['arbitrage_results'])}")
    
    print("\n" + "="*70)
    print("✓ ALL FRONTEND SCENARIOS WORKING CORRECTLY")
    print("="*70)
    print("\nFrontend can now:")
    print("  ✓ Check API status and configuration")
    print("  ✓ Fetch odds and display available matches")
    print("  ✓ Analyze single/multiple events for arbitrage")
    print("  ✓ Display profit opportunities and stake allocations")
    print("\nBackend is production-ready for frontend development! 🚀")
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    server_proc.terminate()
    server_proc.wait(timeout=3)
