import subprocess
import time
import requests
import json

# Start server with stderr captured
print("Starting server...")
server_proc = subprocess.Popen(
    [".venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="C:\\Users\\andre\\OneDrive\\Desktop\\outclassTheOdds",
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,  # Merge stderr into stdout
    text=True,
    bufsize=1
)

# Wait for startup
time.sleep(3)

try:
    # Get odds
    print("Fetching odds...")
    r = requests.get("http://127.0.0.1:8000/odds?sport=soccer_epl&region=us&market=h2h", timeout=5)
    events = r.json()['events'][:1]
    
    # Call arbitrage
    print("Calling /arbitrage...")
    payload = {"events": events, "stake": 100}
    r = requests.post("http://127.0.0.1:8000/arbitrage", json=payload, timeout=5)
    print(f"Response status: {r.status_code}")
    print(f"Response text: {r.text[:500]}")
    
    time.sleep(1)
    
finally:
    print("\n=== SERVER OUTPUT ===")
    server_proc.terminate()
    stdout, _ = server_proc.communicate(timeout=5)
    # Print last 100 lines of server output
    lines = stdout.split('\n')
    for line in lines[-100:]:
        if line.strip():
            print(line)
