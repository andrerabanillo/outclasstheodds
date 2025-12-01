import os
import requests
from typing import List, Optional

from . import sample_data


class OddsClient:
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.the-odds-api.com/v4"):
        self.api_key = api_key or os.getenv("THE_ODDS_API_KEY")
        self.base_url = base_url

    def fetch_odds(self, sport: str = "soccer_epl", regions: str = "us", markets: str = "h2h") -> List[dict]:
        """
        Fetch odds from The Odds API. If API key is missing, return sample events.
        """
        if not self.api_key:
            return sample_data.SAMPLE_EVENTS

        url = f"{self.base_url}/sports/{sport}/odds"
        params = {
            "regions": regions,
            "markets": markets,
            "oddsFormat": "decimal",
            "dateFormat": "unix",
            "apiKey": self.api_key,
        }
        resp = requests.get(url, params=params, timeout=10)
        if resp.status_code != 200:
            raise Exception(f"The Odds API error: {resp.status_code} {resp.text}")
        return resp.json()
