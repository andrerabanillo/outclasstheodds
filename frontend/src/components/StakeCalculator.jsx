import { Calculator } from 'lucide-react'

export default function StakeCalculator({ value, onChange }) {
  const presets = [50, 100, 250, 500, 1000]

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={18} className="text-gold" />
        <span className="font-medium text-platinum">Stake Amount</span>
      </div>
      
      <div className="flex gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === preset
                ? 'bg-gold text-midnight'
                : 'bg-slate/50 text-silver hover:text-platinum hover:bg-slate'
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>
      
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-medium">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-field pl-8 font-mono"
          placeholder="Enter amount"
          min="1"
        />
      </div>
    </div>
  )
}

