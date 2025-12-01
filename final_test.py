#!/usr/bin/env python
"""
Final comprehensive test of all endpoints
"""
import subprocess
import time
import requests
import json

def test_all():
    print("="*60)
    print("OUTCLASS THE ODDS - BACKEND VERIFICATION")
    print("="*60)
    
    # Start server
    print("\n▶ Starting server...")
    server_proc = subprocess.Popen(
        [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    time.sleep(3)
    
    tests_passed = 0
    tests_failed = 0
    
    try:
        # Test 1: Health
        print("\n[1/5] Testing GET /health...")
        r = requests.get("http://127.0.0.1:8000/health", timeout=3)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        assert r.json()["status"] == "ok"
        print("      ✓ PASS")
        tests_passed += 1
        
        # Test 2: Config
        print("\n[2/5] Testing GET /config...")
        r = requests.get("http://127.0.0.1:8000/config", timeout=3)
        assert r.status_code == 200
        assert "has_api_key" in r.json()
        print(f"      ✓ PASS - API Key configured: {r.json()['has_api_key']}")
        tests_passed += 1
        
        # Test 3: Odds
        print("\n[3/5] Testing GET /odds...")
        r = requests.get("http://127.0.0.1:8000/odds?sport=soccer_epl&region=us&market=h2h", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert "events" in data
        assert len(data["events"]) > 0
        print(f"      ✓ PASS - Retrieved {len(data['events'])} events")
        tests_passed += 1
        
        # Test 4: Arbitrage with events from API
        print("\n[4/5] Testing POST /arbitrage (with API data)...")
        event = data["events"][0]
        payload = {"events": [event], "stake": 100}
        r = requests.post("http://127.0.0.1:8000/arbitrage", json=payload, timeout=10)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        result = r.json()
        assert "arbitrage_results" in result
        assert len(result["arbitrage_results"]) > 0
        arb_data = result["arbitrage_results"][0]
        assert "arbitrage" in arb_data
        assert isinstance(arb_data["arbitrage"], bool)  # Ensure it's a proper boolean
        print(f"      ✓ PASS - Event: {arb_data['home_team']} vs {arb_data['away_team']}")
        print(f"              Arbitrage opportunity: {arb_data['arbitrage']}")
        tests_passed += 1
        
        # Test 5: Arbitrage debug
        print("\n[5/5] Testing POST /arbitrage_debug...")
        r = requests.post("http://127.0.0.1:8000/arbitrage_debug", json=payload, timeout=3)
        assert r.status_code == 200
        debug_data = r.json()
        assert debug_data["events_count"] == 1
        print(f"      ✓ PASS - Payload inspection working")
        tests_passed += 1
        
    except AssertionError as e:
        print(f"      ✗ FAIL - {e}")
        tests_failed += 1
    except Exception as e:
        print(f"      ✗ ERROR - {e}")
        tests_failed += 1
    finally:
        server_proc.terminate()
        server_proc.wait(timeout=3)
    
    # Summary
    print("\n" + "="*60)
    print(f"RESULTS: {tests_passed} passed, {tests_failed} failed")
    print("="*60)
    
    if tests_failed == 0:
        print("✓ ALL TESTS PASSED - Backend is ready!")
    else:
        print("✗ SOME TESTS FAILED")
    
    return tests_failed == 0

if __name__ == "__main__":
    success = test_all()
    exit(0 if success else 1)
