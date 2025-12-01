import { motion } from 'framer-motion'
import { Zap, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { getBookmakerInfo } from '../api/client'

export default function ArbitrageCard({ result, index }) {
  const [expanded, setExpanded] = useState(false)

  const isArbitrage = result.arbitrage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass rounded-2xl overflow-hidden ${
        isArbitrage ? 'border-emerald/40 gold-glow' : ''
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-platinum">
              {result.home_team} vs {result.away_team}
            </h3>
            <p className="text-sm text-silver">{result.sport}</p>
          </div>
          {isArbitrage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald/20 text-emerald rounded-full text-sm font-semibold">
              <Zap size={14} />
              Arbitrage Found!
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {isArbitrage ? (
            <>
              <div className="bg-slate/50 rounded-xl p-3">
                <div className="text-silver text-xs mb-1">Profit</div>
                <div className="text-emerald font-mono font-bold text-xl">
                  ${result.profit?.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate/50 rounded-xl p-3">
                <div className="text-silver text-xs mb-1">ROI</div>
                <div className="text-gold font-mono font-bold text-xl">
                  {((result.roi || 0) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-slate/50 rounded-xl p-3">
                <div className="text-silver text-xs mb-1">Payout</div>
                <div className="text-platinum font-mono font-bold text-xl">
                  ${result.payout?.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate/50 rounded-xl p-3">
                <div className="text-silver text-xs mb-1">Sum Inverse</div>
                <div className="text-platinum font-mono font-bold text-xl">
                  {result.sum_inverse_odds?.toFixed(4)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate/50 rounded-xl p-3 col-span-2">
                <div className="text-silver text-xs mb-1">Sum Inverse Odds</div>
                <div className="text-platinum font-mono font-bold text-xl">
                  {result.sum_inverse_odds?.toFixed(4) || 'N/A'}
                </div>
              </div>
              <div className="bg-slate/50 rounded-xl p-3 col-span-2">
                <div className="text-silver text-xs mb-1">Improvement Needed</div>
                <div className="text-ruby font-mono font-bold text-xl">
                  {result.required_improvement 
                    ? `${(result.required_improvement * 100).toFixed(2)}%`
                    : 'N/A'
                  }
                </div>
              </div>
            </>
          )}
        </div>

        {/* Best Offers */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-silver">Best Offers</h4>
          <div className="flex flex-wrap gap-2">
            {result.best_offers?.map((offer, i) => {
              const bookInfo = getBookmakerInfo(offer.bookmaker?.toLowerCase().replace(/\s+/g, ''))
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-slate/50 rounded-lg"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: bookInfo.color }}
                  />
                  <span className="text-platinum font-medium">{offer.outcome}</span>
                  <span className="text-gold font-mono">{offer.odds?.toFixed(2)}</span>
                  <span className="text-silver text-xs">@ {offer.bookmaker}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Allocations (for arbitrage) */}
        {isArbitrage && result.allocations && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm text-gold hover:text-gold-bright transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {expanded ? 'Hide' : 'Show'} Bet Allocations
            </button>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-2"
              >
                {result.allocations.map((alloc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-charcoal rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-gold" />
                      <div>
                        <div className="text-platinum font-medium">{alloc.outcome}</div>
                        <div className="text-silver text-xs">@ {alloc.bookmaker}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gold font-mono font-bold">
                        Bet ${alloc.bet?.toFixed(2)}
                      </div>
                      <div className="text-emerald text-xs font-mono">
                        → ${alloc.payout?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

