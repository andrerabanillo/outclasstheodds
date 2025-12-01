import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react'
import { findArbitrage, REGIONS, MARKETS } from '../api/client'
import SportSelector from '../components/SportSelector'
import ArbitrageCard from '../components/ArbitrageCard'
import StakeCalculator from '../components/StakeCalculator'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ArbitrageFinder() {
  const [sport, setSport] = useState('basketball_nba')
  const [region, setRegion] = useState('us')
  const [market, setMarket] = useState('h2h')
  const [stake, setStake] = useState(100)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'arbitrage', 'close'

  const loadArbitrage = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await findArbitrage(sport, region, market, stake)
      setResults(data.arbitrage_results || [])
    } catch (err) {
      setError(err.message || 'Failed to analyze arbitrage')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArbitrage()
  }, [sport, region, market, stake])

  const filteredResults = results.filter((r) => {
    if (filter === 'arbitrage') return r.arbitrage
    if (filter === 'close') return !r.arbitrage && r.required_improvement && r.required_improvement < 0.05
    return true
  })

  const arbitrageCount = results.filter((r) => r.arbitrage).length
  const closeCount = results.filter((r) => !r.arbitrage && r.required_improvement && r.required_improvement < 0.05).length
  const totalProfit = results.filter((r) => r.arbitrage).reduce((sum, r) => sum + (r.profit || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-platinum flex items-center gap-3">
            <Zap className="text-gold" />
            Arbitrage Finder
          </h1>
          <p className="text-silver">
            Discover guaranteed profit opportunities across sportsbooks
          </p>
        </div>
        <button
          onClick={loadArbitrage}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Scan for Arbitrage
        </button>
      </div>

      {/* Sport Selector */}
      <SportSelector selected={sport} onSelect={setSport} />

      {/* Settings */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
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
        <div className="glass rounded-xl p-4">
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
        <StakeCalculator value={stake} onChange={setStake} />
      </div>

      {/* Stats */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stat-card"
          >
            <div className="text-silver text-sm mb-1">Events Analyzed</div>
            <div className="text-3xl font-display font-bold text-platinum">
              {results.length}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="stat-card border-emerald/30"
          >
            <div className="text-silver text-sm mb-1">Arbitrage Found</div>
            <div className="text-3xl font-display font-bold text-emerald flex items-center gap-2">
              <Zap size={24} />
              {arbitrageCount}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="stat-card border-gold/30"
          >
            <div className="text-silver text-sm mb-1">Close Opportunities</div>
            <div className="text-3xl font-display font-bold text-gold flex items-center gap-2">
              <TrendingUp size={24} />
              {closeCount}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="stat-card"
          >
            <div className="text-silver text-sm mb-1">Total Potential Profit</div>
            <div className="text-3xl font-display font-bold text-gradient">
              ${totalProfit.toFixed(2)}
            </div>
          </motion.div>
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && results.length > 0 && (
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${results.length})` },
            { key: 'arbitrage', label: `Arbitrage (${arbitrageCount})`, color: 'emerald' },
            { key: 'close', label: `Close (${closeCount})`, color: 'gold' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === tab.key
                  ? tab.color === 'emerald'
                    ? 'bg-emerald/20 text-emerald border border-emerald/30'
                    : tab.color === 'gold'
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'bg-slate text-platinum border border-steel/30'
                  : 'text-silver hover:text-platinum hover:bg-slate/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Scanning for arbitrage opportunities..." />
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <AlertTriangle className="text-ruby mx-auto mb-4" size={48} />
          <p className="text-ruby mb-4">{error}</p>
          <button onClick={loadArbitrage} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-silver">
            {filter === 'arbitrage'
              ? 'No arbitrage opportunities found. Try a different sport or check back later.'
              : filter === 'close'
              ? 'No close opportunities found within 5% of arbitrage.'
              : 'No events found for this selection.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result, index) => (
            <ArbitrageCard key={result.event_id} result={result} index={index} />
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="glass rounded-2xl p-6 border-gold/20">
        <h3 className="font-semibold text-platinum mb-2 flex items-center gap-2">
          <AlertTriangle className="text-gold" size={18} />
          What is Arbitrage Betting?
        </h3>
        <p className="text-silver text-sm leading-relaxed">
          Arbitrage betting exploits differences in odds between sportsbooks to guarantee a profit 
          regardless of the outcome. When the sum of inverse odds is less than 1.0, an arbitrage 
          opportunity exists. This calculator shows you exactly how much to bet at each sportsbook 
          to maximize your guaranteed return.
        </p>
      </div>
    </div>
  )
}

