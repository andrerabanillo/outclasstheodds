SAMPLE_EVENTS = [
    {
        "id": "evt1",
        "sport_key": "soccer_epl",
        "home_team": "Team A",
        "away_team": "Team B",
        "bookmakers": [
            {
                "key": "dk",
                "title": "DraftKings",
                "markets": [
                    {
                        "key": "h2h",
                        "outcomes": [
                            {"name": "Team A", "price": 2.1},
                            {"name": "Team B", "price": 1.8},
                        ],
                    }
                ],
            },
            {
                "key": "bmg",
                "title": "BetMGM",
                "markets": [
                    {
                        "key": "h2h",
                        "outcomes": [
                            {"name": "Team A", "price": 2.05},
                            {"name": "Team B", "price": 1.85},
                        ],
                    }
                ],
            },
        ],
    },
    {
        "id": "evt2",
        "sport_key": "nba",
        "home_team": "Lakers",
        "away_team": "Heat",
        "bookmakers": [
            {
                "key": "dk",
                "title": "DraftKings",
                "markets": [
                    {
                        "key": "h2h",
                        "outcomes": [
                            {"name": "Lakers", "price": 1.9},
                            {"name": "Heat", "price": 2.05},
                        ],
                    }
                ],
            },
            {
                "key": "bmg",
                "title": "BetMGM",
                "markets": [
                    {
                        "key": "h2h",
                        "outcomes": [
                            {"name": "Lakers", "price": 2.15},
                            {"name": "Heat", "price": 1.75},
                        ],
                    }
                ],
            },
        ],
    },
]
