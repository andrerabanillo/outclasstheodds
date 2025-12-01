#!/usr/bin/env python
"""
FINAL VERIFICATION TEST - All endpoints and functionality
"""
import subprocess
import time
import requests
import json
import sys

print("=" * 70)
print("OUTCLASS THE ODDS - BACKEND VERIFICATION TEST")
print("=" * 70)

# Start server
print("\n[1/6] Starting server...")
server_proc = subprocess.Popen(
    [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(4)  # Wait for startup

try:
    BASE_URL = "http://127.0.0.1:8000"
    
    # TEST 1: Health Check
    print("\n[2/6] Testing /health endpoint...")
    r = requests.get(f"{BASE_URL}/health", timeout=3)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert r.json() == {"status": "ok"}, f"Unexpected response: {r.json()}"
    print("     ✓ PASS - Health check working")
    
    # TEST 2: Config Check
    print("\n[3/6] Testing /config endpoint...")
    r = requests.get(f"{BASE_URL}/config", timeout=3)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    config = r.json()
    assert "has_api_key" in config, f"Missing 'has_api_key': {config}"
    print(f"     ✓ PASS - Config check working (has_api_key: {config['has_api_key']})")
    
    # TEST 3: Odds Endpoint
    print("\n[4/6] Testing /odds endpoint...")
    r = requests.get(f"{BASE_URL}/odds?sport=soccer_epl&region=us&market=h2h", timeout=8)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    odds_data = r.json()
    assert "events" in odds_data, f"Missing 'events' in response"
    assert len(odds_data["events"]) > 0, "No events returned"
    events_count = len(odds_data["events"])
    print(f"     ✓ PASS - Fetched {events_count} events from API")
    
    # TEST 4: Arbitrage with Real API Data
    print("\n[5/6] Testing /arbitrage endpoint with real API data...")
    event = odds_data["events"][0]
    payload = {"events": [event], "stake": 100}
    r = requests.post(f"{BASE_URL}/arbitrage", json=payload, timeout=5)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
    arb_data = r.json()
    assert "arbitrage_results" in arb_data, f"Missing 'arbitrage_results': {arb_data}"
    result = arb_data["arbitrage_results"][0]
    
    # Verify result structure
    required_keys = ["event_id", "sport", "home_team", "away_team", "best_offers", "arbitrage"]
    for key in required_keys:
        assert key in result, f"Missing key '{key}' in result"
    
    assert isinstance(result["arbitrage"], bool), f"'arbitrage' should be bool, got {type(result['arbitrage'])}"
    assert isinstance(result["best_offers"], list), f"'best_offers' should be list, got {type(result['best_offers'])}"
    
    print(f"     ✓ PASS - Arbitrage analysis working")
    print(f"       - Event: {result['home_team']} vs {result['away_team']}")
    print(f"       - Arbitrage found: {result['arbitrage']}")
    print(f"       - Best offers: {len(result['best_offers'])} outcomes")
    
    # TEST 5: Arbitrage with Mock Data
    print("\n[6/6] Testing /arbitrage endpoint with mock event...")
    mock_event = {
        "id": "mock123",
        "sport_key": "test_sport",
        "home_team": "Team A",
        "away_team": "Team B",
        "bookmakers": [
            {
                "title": "Bookmaker1",
                "markets": [{
                    "key": "h2h",
                    "outcomes": [
                        {"name": "Team A", "price": 2.0},
                        {"name": "Draw", "price": 3.5},
                        {"name": "Team B", "price": 3.2}
                    ]
                }]
            }
        ]
    }
    
    payload = {"events": [mock_event], "stake": 50}
    r = requests.post(f"{BASE_URL}/arbitrage", json=payload, timeout=5)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    arb_data = r.json()
    assert len(arb_data["arbitrage_results"]) == 1, "Should have 1 result"
    print(f"     ✓ PASS - Mock event processed successfully")
    
    print("\n" + "=" * 70)
    print("✓ ALL TESTS PASSED - Backend is fully functional!")
    print("=" * 70)
    print("\nEndpoints ready:")
    print("  • GET  /health              - Server health check")
    print("  • GET  /config              - Configuration info")
    print("  • GET  /odds                - Fetch betting odds")
    print("  • POST /arbitrage           - Analyze arbitrage opportunities")
    print("  • POST /arbitrage_debug     - Debug endpoint payload structure")
    print("\nServer is running on http://127.0.0.1:8000")
    
except AssertionError as e:
    print(f"\n✗ TEST FAILED: {e}")
    sys.exit(1)
except Exception as e:
    import traceback
    print(f"\n✗ UNEXPECTED ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)
finally:
    server_proc.terminate()
    try:
        server_proc.wait(timeout=3)
    except subprocess.TimeoutExpired:
        server_proc.kill()
    print("\nServer stopped.")
