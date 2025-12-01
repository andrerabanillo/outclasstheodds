import { motion } from 'framer-motion'
import { SPORTS } from '../api/client'

export default function SportSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SPORTS.map((sport) => (
        <motion.button
          key={sport.key}
          onClick={() => onSelect(sport.key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            selected === sport.key
              ? 'bg-gold text-midnight'
              : 'glass glass-hover text-silver hover:text-platinum'
          }`}
        >
          <span className="text-lg">{sport.icon}</span>
          <span>{sport.name}</span>
        </motion.button>
      ))}
    </div>
  )
}

