import subprocess
import time
import requests
import json

# Start server
print("Starting server...")
server_proc = subprocess.Popen(
    [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for startup
time.sleep(3)

try:
    # Test 1: Health check
    print("\n1. Testing /health...")
    r = requests.get("http://127.0.0.1:8000/health", timeout=2)
    print(f"   Status: {r.status_code}, Response: {r.json()}")
    
    # Test 2: Config check
    print("\n2. Testing /config...")
    r = requests.get("http://127.0.0.1:8000/config", timeout=2)
    print(f"   Status: {r.status_code}, Response: {r.json()}")
    
    # Test 3: Odds endpoint
    print("\n3. Testing /odds...")
    r = requests.get("http://127.0.0.1:8000/odds?sport=soccer_epl&region=us&market=h2h", timeout=5)
    print(f"   Status: {r.status_code}, Events: {len(r.json()['events'])}")
    
    # Test 4: Arbitrage endpoint
    print("\n4. Testing /arbitrage...")
    events = r.json()['events'][:1]  # Just first event
    payload = {"events": events, "stake": 100}
    r = requests.post("http://127.0.0.1:8000/arbitrage", json=payload, timeout=5)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        result = r.json()
        print(f"   ✓ SUCCESS - Got {len(result['arbitrage_results'])} result(s)")
        print(f"   First result: {json.dumps(result['arbitrage_results'][0], indent=2, default=str)[:300]}")
    else:
        print(f"   ✗ FAILED - {r.text[:200]}")
    
    print("\n✓ All tests completed!")
    
finally:
    print("\nShutting down server...")
    server_proc.terminate()
    server_proc.wait(timeout=5)
