import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Search, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { checkConfig, SPORTS, BOOKMAKERS } from '../api/client'

export default function Dashboard() {
  const [hasApiKey, setHasApiKey] = useState(null)

  useEffect(() => {
    checkConfig().then(data => setHasApiKey(data.has_api_key)).catch(() => setHasApiKey(false))
  }, [])

  const features = [
    {
      icon: Search,
      title: 'Odds Explorer',
      description: 'Browse and compare betting lines across all major sportsbooks in real-time.',
      link: '/odds',
      color: 'from-sapphire to-amethyst',
    },
    {
      icon: Zap,
      title: 'Arbitrage Finder',
      description: 'Discover guaranteed profit opportunities with our advanced arbitrage detection.',
      link: '/arbitrage',
      color: 'from-emerald to-sapphire',
    },
    {
      icon: TrendingUp,
      title: 'Line Comparison',
      description: 'Find the best value by comparing odds across different bookmakers.',
      link: '/odds',
      color: 'from-gold to-gold-bright',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Outclass</span>
            <br />
            <span className="text-platinum">The Odds</span>
          </h1>
          <p className="text-xl text-silver max-w-2xl mx-auto mb-8">
            Your edge in sports betting. Compare lines, find arbitrage opportunities, 
            and make smarter bets across all major sportsbooks.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/odds" className="btn-primary flex items-center gap-2">
              <Search size={18} />
              Explore Odds
            </Link>
            <Link to="/arbitrage" className="btn-secondary flex items-center gap-2">
              <Zap size={18} />
              Find Arbitrage
            </Link>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* API Status */}
      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {hasApiKey === null ? (
            <div className="text-silver">Checking API configuration...</div>
          ) : hasApiKey ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
                <CheckCircle className="text-emerald" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-platinum">API Connected</h3>
                <p className="text-sm text-silver">Live odds data is available</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <AlertCircle className="text-gold" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-platinum">Demo Mode</h3>
                <p className="text-sm text-silver">Using sample data. Add THE_ODDS_API_KEY for live data.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={feature.link}
              className="block glass rounded-2xl p-6 glass-hover group h-full"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-xl text-platinum mb-2 group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-silver mb-4">{feature.description}</p>
              <div className="flex items-center gap-2 text-gold text-sm font-medium">
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-4xl font-display font-bold text-gradient mb-2">
            {SPORTS.length}
          </div>
          <div className="text-silver">Sports Covered</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-display font-bold text-gradient mb-2">
            {Object.keys(BOOKMAKERS).length}+
          </div>
          <div className="text-silver">Sportsbooks</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-display font-bold text-gradient mb-2">
            3
          </div>
          <div className="text-silver">Market Types</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-display font-bold text-gradient mb-2">
            24/7
          </div>
          <div className="text-silver">Live Updates</div>
        </div>
      </section>

      {/* Sportsbooks */}
      <section className="glass rounded-2xl p-8">
        <h2 className="font-display text-2xl font-semibold text-platinum mb-6 text-center">
          Supported Sportsbooks
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(BOOKMAKERS).slice(0, 8).map(([key, book]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-4 py-2 bg-slate/50 rounded-xl"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: book.color }}
              />
              <span className="text-platinum font-medium">{book.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

