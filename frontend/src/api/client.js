import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export const SPORTS = [
  { key: 'americanfootball_nfl', name: 'NFL', icon: '🏈' },
  { key: 'americanfootball_ncaaf', name: 'NCAAF', icon: '🏈' },
  { key: 'basketball_nba', name: 'NBA', icon: '🏀' },
  { key: 'basketball_ncaab', name: 'NCAAB', icon: '🏀' },
  { key: 'icehockey_nhl', name: 'NHL', icon: '🏒' },
  { key: 'baseball_mlb', name: 'MLB', icon: '⚾' },
  { key: 'soccer_epl', name: 'EPL', icon: '⚽' },
  { key: 'soccer_usa_mls', name: 'MLS', icon: '⚽' },
  { key: 'mma_mixed_martial_arts', name: 'MMA', icon: '🥊' },
]

export const REGIONS = [
  { key: 'us', name: 'United States' },
  { key: 'uk', name: 'United Kingdom' },
  { key: 'eu', name: 'Europe' },
  { key: 'au', name: 'Australia' },
]

export const MARKETS = [
  { key: 'h2h', name: 'Moneyline (H2H)' },
  { key: 'spreads', name: 'Spreads' },
  { key: 'totals', name: 'Totals (O/U)' },
]

export const BOOKMAKERS = {
  draftkings: { name: 'DraftKings', color: '#53d337' },
  fanduel: { name: 'FanDuel', color: '#1493ff' },
  betmgm: { name: 'BetMGM', color: '#c5a44e' },
  caesars: { name: 'Caesars', color: '#a89968' },
  pointsbetus: { name: 'PointsBet', color: '#ed1c24' },
  bovada: { name: 'Bovada', color: '#cc0000' },
  betonlineag: { name: 'BetOnline', color: '#ff6600' },
  betrivers: { name: 'BetRivers', color: '#ffc629' },
  unibet_us: { name: 'Unibet', color: '#14805e' },
  williamhill_us: { name: 'William Hill', color: '#00473b' },
  fliff: { name: 'Fliff', color: '#7c3aed' },
  hardrockbet: { name: 'Hard Rock', color: '#d4af37' },
}

export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}

export async function checkConfig() {
  const { data } = await api.get('/config')
  return data
}

export async function fetchOdds(sport = 'soccer_epl', region = 'us', market = 'h2h') {
  const { data } = await api.get('/odds', { params: { sport, region, market } })
  return data
}

export async function findArbitrage(sport, region = 'us', market = 'h2h', stake = 100) {
  const { data } = await api.post('/arbitrage', { sport, region, market, stake })
  return data
}

export function formatOdds(decimal) {
  if (!decimal) return '-'
  
  // Convert to American odds
  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`
  } else {
    return `${Math.round(-100 / (decimal - 1))}`
  }
}

export function getBookmakerInfo(key) {
  return BOOKMAKERS[key] || { name: key, color: '#666666' }
}

