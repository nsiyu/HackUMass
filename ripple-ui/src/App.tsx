import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import BirdSanctuary from './pages/BirdSanctuary'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AuthModal from './components/AuthModal'
import Leaderboard from './pages/Leaderboard'
import DailyChallenge from './pages/DailyChallenge'
import Chat from './pages/Chat'

const App = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing session={session} setShowAuthModal={setShowAuthModal} />} />
        <Route 
          path="/sanctuary" 
          element={<BirdSanctuary session={session} setShowAuthModal={setShowAuthModal} />} 
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/daily-challenge" element={<DailyChallenge />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

export default App