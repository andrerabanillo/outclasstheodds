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
    print("First event keys:", list(events[0].keys()))
    print("First event bookmakers count:", len(events[0].get("bookmakers", [])))
    
    # Now test arbitrage
    try:
        results = find_arbitrage_for_events([events[0]], stake=100.0)
        print("Arbitrage results:", json.dumps(results, indent=2, default=str))
    except Exception as e:
        import traceback
        print("ERROR in arbitrage:")
        traceback.print_exc()
