from typing import List, Dict, Any
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _extract_market(bookmakers: List[dict], market_key: str = "h2h") -> List[dict]:
    # returns list of tuples (bookmaker, outcome_name, price)
    rows = []
    for bm in bookmakers:
        # defensive access: bookmaker may not be a dict
        if not isinstance(bm, dict):
            continue
        btitle = bm.get("title") or bm.get("key")
        markets = bm.get("markets") or []
        if not isinstance(markets, list):
            continue
        for m in markets:
            if not isinstance(m, dict):
                continue
            if m.get("key") != market_key:
                continue
            outcomes = m.get("outcomes") or []
            if not isinstance(outcomes, list):
                continue
            for o in outcomes:
                try:
                    if not isinstance(o, dict):
                        continue
                    name = o.get("name") or o.get("label") or o.get("team")
                    price_val = o.get("price")
                    if price_val is None:
                        # some APIs return 'point' or nested price structures
                        price_val = o.get("odds") or o.get("decimal")
                    price = float(price_val)
                except Exception:
                    # skip outcomes we can't parse
                    continue
                rows.append({
                    "bookmaker": btitle,
                    "outcome": name,
                    "price": price,
                })
    return rows


def analyze_event_for_arbitrage(event: dict, market_key: str = "h2h", stake: float = 100.0) -> Dict[str, Any]:
    bookmakers = event.get("bookmakers", [])
    try:
        rows = _extract_market(bookmakers, market_key=market_key)
    except Exception as e:
        return {"event_id": event.get("id"), "arbitrage": False, "error": f"extract_error: {str(e)}"}
    if not rows:
        return {"event_id": event.get("id"), "arbitrage": False, "reason": "no_market_data"}

    df = pd.DataFrame(rows)

    # For each outcome, find the best (highest) price and which bookmaker
    best = df.sort_values("price", ascending=False).groupby("outcome", as_index=False).first()

    # If number of possible outcomes < 2, cannot compute
    if best.shape[0] < 2:
        return {"event_id": event.get("id"), "arbitrage": False, "reason": "insufficient_outcomes"}

    odds = best["price"].values
    outcomes = best["outcome"].values
    books = best["bookmaker"].values

    sum_inv = np.sum(1.0 / odds)
    arbitrage_exists = bool(sum_inv < 1.0)  # Convert numpy bool to Python bool

    result = {
        "event_id": event.get("id"),
        "sport": event.get("sport_key"),
        "home_team": event.get("home_team"),
        "away_team": event.get("away_team"),
        "best_offers": [],
        "arbitrage": arbitrage_exists,
    }

    for o, p, b in zip(outcomes, odds, books):
        result["best_offers"].append({"outcome": o, "odds": float(p), "bookmaker": b})

    if arbitrage_exists:
        payout = stake / sum_inv
        profit = payout - stake
        roi = (payout / stake) - 1.0

        # compute stake allocation per selection: proportion = (1/odds_i)/sum_inv
        allocations = []
        for o, p, b in zip(outcomes, odds, books):
            proportion = (1.0 / p) / sum_inv
            bet = proportion * stake
            allocations.append({"outcome": o, "bookmaker": b, "odds": float(p), "bet": float(round(bet, 2)), "payout": float(round(bet * p, 2))})

        result.update({
            "sum_inverse_odds": float(sum_inv),
            "payout": float(round(payout, 2)),
            "profit": float(round(profit, 2)),
            "roi": float(round(roi, 4)),
            "allocations": allocations,
        })
    else:
        # include a helpful metric: required combined improvement to reach arbitrage
        result.update({"sum_inverse_odds": float(sum_inv), "required_improvement": float(round(sum_inv - 1.0, 6))})

    return result


def find_arbitrage_for_events(events: List[dict], market_key: str = "h2h", stake: float = 100.0) -> List[dict]:
    results = []
    for ev in events:
        try:
            res = analyze_event_for_arbitrage(ev, market_key=market_key, stake=stake)
        except Exception as e:
            # Don't let one bad event take down the whole response; return diagnostic info
            logger.exception("Error analyzing event %s", ev.get("id"))
            res = {"event_id": ev.get("id"), "arbitrage": False, "error": f"analysis_error: {str(e)}"}
        results.append(res)
    return results
