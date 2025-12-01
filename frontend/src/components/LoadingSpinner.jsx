import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', message }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} rounded-full border-2 border-steel border-t-gold`}
      />
      {message && <p className="text-silver text-sm">{message}</p>}
    </div>
  )
}

