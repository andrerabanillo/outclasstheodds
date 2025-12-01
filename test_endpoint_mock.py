"""
Integration test: Start server and test /arbitrage with mock events passed directly.
"""
import subprocess
import time
import requests
import json

# Start server with longer startup wait and capture stderr
print("Starting server...")
server_proc = subprocess.Popen(
    [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)

# Wait for startup
time.sleep(4)

try:
    # Mock event
    mock_event = {
        "id": "test1",
        "sport_key": "soccer_epl",
        "home_team": "Home",
        "away_team": "Away",
        "bookmakers": [
            {
                "title": "Book1",
                "markets": [{
                    "key": "h2h",
                    "outcomes": [
                        {"name": "Home", "price": 2.0},
                        {"name": "Draw", "price": 3.5},
                        {"name": "Away", "price": 3.2}
                    ]
                }]
            }
        ]
    }
    
    print("Testing /health...")
    r = requests.get("http://127.0.0.1:8000/health", timeout=2)
    assert r.status_code == 200
    print(f"✓ Health: {r.json()}")
    
    print("\nTesting /arbitrage with mock event...")
    payload = {"events": [mock_event], "stake": 50}
    r = requests.post("http://127.0.0.1:8000/arbitrage", json=payload, timeout=10)
    print(f"Status: {r.status_code}")
    
    if r.status_code == 200:
        print("✓ SUCCESS")
        result = r.json()
        print(json.dumps(result, indent=2, default=str)[:500])
    else:
        print(f"✗ FAILED - {r.text[:300]}")
        
except Exception as e:
    import traceback
    print(f"\n✗ Exception: {e}")
    traceback.print_exc()
finally:
    server_proc.terminate()
    stdout, stderr = server_proc.communicate(timeout=3)
    print("\n=== SERVER STDERR ===")
    print(stderr[-2000:] if stderr else "(no output)")  # Last 2000 chars
    print("\nServer stopped")
