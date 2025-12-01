import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import OddsComparison from './OddsComparison'

export default function EventCard({ event, market = 'h2h', expanded, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-slate/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <span className="font-semibold text-platinum text-lg">
              {event.home_team}
            </span>
            <span className="text-silver text-sm">vs</span>
            <span className="font-semibold text-platinum text-lg">
              {event.away_team}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-silver">
              {event.bookmakers?.length || 0} sportsbooks
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="text-silver" size={24} />
          </motion.div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-steel/20 p-5"
        >
          <OddsComparison bookmakers={event.bookmakers} teams={[event.home_team, event.away_team]} market={market} />
        </motion.div>
      )}
    </motion.div>
  )
}

