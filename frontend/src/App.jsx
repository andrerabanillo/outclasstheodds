import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import OddsExplorer from './pages/OddsExplorer'
import ArbitrageFinder from './pages/ArbitrageFinder'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/odds" element={<OddsExplorer />} />
        <Route path="/arbitrage" element={<ArbitrageFinder />} />
      </Routes>
    </Layout>
  )
}

export default App

