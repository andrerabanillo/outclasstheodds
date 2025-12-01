import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatOdds, getBookmakerInfo } from '../api/client'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function OddsComparison({ bookmakers, teams, market = 'h2h' }) {
  const comparisonData = useMemo(() => {
    if (!bookmakers || bookmakers.length === 0) return null

    // Build matrix: outcome -> bookmaker -> odds data
    const outcomeMap = {}
    const bookList = []

    bookmakers.forEach((bm) => {
      const info = getBookmakerInfo(bm.key)
      bookList.push({ key: bm.key, title: bm.title || info.name, color: info.color })

      bm.markets?.forEach((m) => {
        if (m.key === market) {
          m.outcomes?.forEach((outcome) => {
            // For spreads/totals, create a unique key that includes the point
            let outcomeKey = outcome.name
            let displayName = outcome.name
            let point = outcome.point

            if (market === 'spreads' && point !== undefined) {
              // For spreads: "Team A -3.5" or "Team B +3.5"
              const pointStr = point >= 0 ? `+${point}` : `${point}`
              outcomeKey = `${outcome.name}|spread`
              displayName = `${outcome.name} (${pointStr})`
            } else if (market === 'totals' && point !== undefined) {
              // For totals: "Over 220.5" or "Under 220.5"
              outcomeKey = `${outcome.name}|${point}`
              displayName = `${outcome.name} ${point}`
            }

            if (!outcomeMap[outcomeKey]) {
              outcomeMap[outcomeKey] = {
                displayName,
                baseName: outcome.name,
                point,
                prices: {}
              }
            }
            
            outcomeMap[outcomeKey].prices[bm.key] = {
              price: outcome.price,
              point: outcome.point
            }
          })
        }
      })
    })

    // Find best odds for each outcome
    const outcomes = Object.entries(outcomeMap).map(([key, data]) => {
      const priceEntries = Object.entries(data.prices)
      const best = priceEntries.reduce(
        (max, [k, v]) => (v.price > max.price ? { book: k, price: v.price } : max),
        { book: '', price: 0 }
      )
      const worst = priceEntries.reduce(
        (min, [k, v]) => (v.price < min.price ? { book: k, price: v.price } : min),
        { book: '', price: Infinity }
      )

      return {
        key,
        displayName: data.displayName,
        baseName: data.baseName,
        point: data.point,
        prices: data.prices,
        best,
        worst
      }
    })

    // Sort outcomes for better display
    outcomes.sort((a, b) => {
      if (market === 'totals') {
        // Over before Under
        if (a.baseName === 'Over' && b.baseName === 'Under') return -1
        if (a.baseName === 'Under' && b.baseName === 'Over') return 1
      }
      return a.displayName.localeCompare(b.displayName)
    })

    return { outcomes, bookmakers: bookList }
  }, [bookmakers, market])

  if (!comparisonData || comparisonData.outcomes.length === 0) {
    return (
      <div className="text-silver text-center py-8">
        No {market === 'h2h' ? 'moneyline' : market} odds data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Market Type Label */}
      <div className="text-xs text-gold font-medium uppercase tracking-wide">
        {market === 'h2h' ? 'Moneyline' : market === 'spreads' ? 'Point Spread' : 'Totals (Over/Under)'}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-silver font-medium pb-3 pr-4 min-w-[140px]">
                Outcome
              </th>
              {comparisonData.bookmakers.map((bm) => (
                <th
                  key={bm.key}
                  className="text-center text-silver font-medium pb-3 px-2 min-w-[100px]"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: bm.color }}
                    />
                    <span className="text-xs">{bm.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.outcomes.map((outcome, idx) => (
              <motion.tr
                key={outcome.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-t border-steel/10"
              >
                <td className="py-3 pr-4">
                  <span className="font-semibold text-platinum">{outcome.displayName}</span>
                </td>
                {comparisonData.bookmakers.map((bm) => {
                  const data = outcome.prices[bm.key]
                  const price = data?.price
                  const point = data?.point
                  const isBest = outcome.best.book === bm.key
                  const isWorst = outcome.worst.book === bm.key && comparisonData.bookmakers.length > 1

                  return (
                    <td key={bm.key} className="py-3 px-2 text-center">
                      {price ? (
                        <div
                          className={`inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg font-mono text-sm ${
                            isBest
                              ? 'bg-emerald/20 text-emerald border border-emerald/30'
                              : isWorst
                              ? 'bg-ruby/10 text-ruby/70 border border-ruby/20'
                              : 'bg-slate/50 text-platinum'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {isBest && <TrendingUp size={14} />}
                            {isWorst && <TrendingDown size={14} />}
                            {market !== 'h2h' && point !== undefined && (
                              <span className="text-gold text-xs mr-1">
                                {market === 'spreads' 
                                  ? (point >= 0 ? `+${point}` : point)
                                  : point
                                }
                              </span>
                            )}
                            <span>{price.toFixed(2)}</span>
                          </div>
                          <span className="text-silver text-xs">
                            ({formatOdds(price)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-steel">—</span>
                      )}
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 text-xs text-silver">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald/20 border border-emerald/30" />
          <span>Best odds</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-ruby/10 border border-ruby/20" />
          <span>Worst odds</span>
        </div>
        {market !== 'h2h' && (
          <div className="flex items-center gap-1">
            <span className="text-gold">+/-</span>
            <span>Line/Point</span>
          </div>
        )}
      </div>
    </div>
  )
}
