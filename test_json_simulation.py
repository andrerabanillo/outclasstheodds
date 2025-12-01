import os
import json
from dotenv import load_dotenv
from app.client import OddsClient
from app.arbitrage import find_arbitrage_for_events

load_dotenv()
api_key = os.getenv("THE_ODDS_API_KEY")
client = OddsClient(api_key=api_key)

# Fetch one event
events = client.fetch_odds(sport="soccer_epl", regions="us", markets="h2h")
print("Fetched events count:", len(events))

if events:
    event = events[0]
    print("\n=== Testing with real API event ===")
    print("Event type:", type(event))
    print("Event keys:", list(event.keys()))
    
    # Simulate what FastAPI will receive after JSON serialization/deserialization
    event_json_str = json.dumps(event)
    event_reconstructed = json.loads(event_json_str)
    
    print("\nReconstructed event type:", type(event_reconstructed))
    print("Reconstructed event keys:", list(event_reconstructed.keys()))
    
    # Now test arbitrage with reconstructed event
    try:
        print("\nCalling find_arbitrage_for_events...")
        results = find_arbitrage_for_events([event_reconstructed], stake=100.0)
        print("SUCCESS - Arbitrage results:", json.dumps(results, indent=2, default=str))
    except Exception as e:
        import traceback
        print("ERROR in arbitrage:")
        traceback.print_exc()
        print("\nEvent that caused the error:")
        print(json.dumps(event_reconstructed, indent=2, default=str))
