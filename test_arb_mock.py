"""
Direct test of arbitrage endpoint with minimal dependencies.
"""
import json
from app.arbitrage import find_arbitrage_for_events

# Mock event with realistic structure
mock_event = {
    "id": "test_event_1",
    "sport_key": "soccer_epl",
    "sport_title": "EPL",
    "commence_time": "2025-12-01T15:00:00Z",
    "home_team": "Test Home",
    "away_team": "Test Away",
    "bookmakers": [
        {
            "key": "draftkings",
            "title": "DraftKings",
            "markets": [
                {
                    "key": "h2h",
                    "outcomes": [
                        {"name": "Test Home", "price": 2.0},
                        {"name": "Draw", "price": 3.5},
                        {"name": "Test Away", "price": 3.2}
                    ]
                }
            ]
        },
        {
            "key": "betmgm",
            "title": "BetMGM",
            "markets": [
                {
                    "key": "h2h",
                    "outcomes": [
                        {"name": "Test Home", "price": 1.95},
                        {"name": "Draw", "price": 3.4},
                        {"name": "Test Away", "price": 3.3}
                    ]
                }
            ]
        }
    ]
}

print("Testing arbitrage function with mock event...")
try:
    results = find_arbitrage_for_events([mock_event], stake=100.0)
    print("✓ SUCCESS")
    print(json.dumps(results, indent=2, default=str))
except Exception as e:
    import traceback
    print("✗ FAILED")
    traceback.print_exc()
