from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Any
import os
from dotenv import load_dotenv

from app.client import OddsClient
from app.arbitrage import find_arbitrage_for_events

app = FastAPI(title="Outclass The Odds - Backend")

# Load environment variables from a local .env file if present
load_dotenv()


class ArbitrageRequest(BaseModel):
    sport: Optional[str] = None
    region: Optional[str] = "us"
    market: Optional[str] = "h2h"
    events: Optional[List[Any]] = None
    stake: Optional[float] = 100.0
    
    class Config:
        # Allow arbitrary types for maximum flexibility
        arbitrary_types_allowed = True


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/odds")
def get_odds(sport: str = "soccer_epl", region: str = "us", market: str = "h2h"):
    api_key = os.getenv("THE_ODDS_API_KEY")
    client = OddsClient(api_key=api_key)
    try:
        events = client.fetch_odds(sport=sport, regions=region, markets=market)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    return {"sport": sport, "region": region, "market": market, "events": events}


@app.get("/config")
def config():
    """Return whether the server process has an API key configured (does not reveal the key)."""
    has_key = bool(os.getenv("THE_ODDS_API_KEY"))
    return {"has_api_key": has_key}


@app.post("/arbitrage")
def arbitrage(req: ArbitrageRequest):
    api_key = os.getenv("THE_ODDS_API_KEY")
    client = OddsClient(api_key=api_key)

    # Obtain events either from client or request body
    if req.events:
        events = req.events
    else:
        if not req.sport:
            raise HTTPException(status_code=400, detail="sport is required when not providing events")
        try:
            events = client.fetch_odds(sport=req.sport, regions=req.region or "us", markets=req.market or "h2h")
        except Exception as e:
            raise HTTPException(status_code=502, detail=str(e))

    try:
        results = find_arbitrage_for_events(events, stake=req.stake or 100.0)
    except Exception as e:
        # Return a helpful error message instead of a generic 500 stack trace
        raise HTTPException(status_code=500, detail={"error": "arbitrage_processing_failed", "message": str(e)})
    return {"arbitrage_results": results}


@app.post("/arbitrage_debug")
def arbitrage_debug(payload: dict = Body(...)):
    """Diagnostic endpoint: return counts and sample of received payload without processing."""
    events = payload.get("events") if isinstance(payload, dict) else None
    return {
        "received_keys": list(payload.keys()) if isinstance(payload, dict) else None,
        "events_count": len(events) if isinstance(events, list) else None,
        "first_event": events[0] if isinstance(events, list) and len(events) > 0 else None,
        "raw_payload_type": type(payload).__name__,
    }
