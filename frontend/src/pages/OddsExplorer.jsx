import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Filter } from 'lucide-react'
import { fetchOdds, REGIONS, MARKETS } from '../api/client'
import SportSelector from '../components/SportSelector'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'

// Helper to check if an event has data for a specific market
function eventHasMarketData(event, marketKey) {
  if (!event.bookmakers || event.bookmakers.length === 0) return false
  
  return event.bookmakers.some((bm) => 
    bm.markets?.some((m) => 
      m.key === marketKey && m.outcomes && m.outcomes.length > 0
    )
  )
}

export default function OddsExplorer() {
  const [sport, setSport] = useState('basketball_nba')
  const [region, setRegion] = useState('us')
  const [market, setMarket] = useState('h2h')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedEvent, setExpandedEvent] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter events to only those with data for the selected market
  const filteredEvents = useMemo(() => {
    return events.filter((event) => eventHasMarketData(event, market))
  }, [events, market])

  const loadOdds = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOdds(sport, region, market)
      setEvents(data.events || [])
    } catch (err) {
      setError(err.message || 'Failed to load odds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOdds()
  }, [sport, region, market])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-platinum">
            Odds Explorer
          </h1>
          <p className="text-silver">
            Compare betting lines across all major sportsbooks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-secondary flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={loadOdds}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Sport Selector */}
      <SportSelector selected={sport} onSelect={setSport} />

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters || window.innerWidth >= 768 ? 'auto' : 0 }}
        className="overflow-hidden md:!h-auto"
      >
        <div className="glass rounded-xl p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-silver mb-2">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input-field"
            >
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-silver mb-2">Market</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="input-field"
            >
              {MARKETS.map((m) => (
                <option key={m.key} value={m.key}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading odds..." />
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-ruby mb-4">{error}</p>
          <button onClick={loadOdds} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-silver">
            {events.length > 0 
              ? `No ${market === 'h2h' ? 'moneyline' : market} odds available for the ${events.length} events found.`
              : 'No events found for this selection.'
            }
          </p>
          {events.length > 0 && market !== 'h2h' && (
            <p className="text-silver/60 text-sm mt-2">
              Try switching to Moneyline (H2H) for more results.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-silver text-sm">
            {filteredEvents.length} event{filteredEvents.length !== 1 && 's'} with {market === 'h2h' ? 'moneyline' : market} odds
            {filteredEvents.length < events.length && (
              <span className="text-silver/60"> (out of {events.length} total)</span>
            )}
          </p>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              market={market}
              expanded={expandedEvent === event.id}
              onToggle={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

