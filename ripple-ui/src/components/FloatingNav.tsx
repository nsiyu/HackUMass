import { FC } from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  TrophyIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

interface FloatingNavProps {
  session: Session | null
  setShowAuthModal: (show: boolean) => void
}

const FloatingNav: FC<FloatingNavProps> = ({ session, setShowAuthModal }) => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="fixed top-4 left-4">
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/profile')}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-light-coral hover:text-white shadow-md"
          title="Profile"
        >
          <UserCircleIcon className="w-7 h-7" />
        </button>
        <button 
          onClick={() => navigate('/leaderboard')}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-coral-pink hover:text-white shadow-md"
          title="Leaderboard"
        >
          <TrophyIcon className="w-7 h-7" />
        </button>
        <button 
          onClick={() => navigate('/daily-challenge')}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-melon hover:text-white shadow-md"
          title="Daily Challenges"
        >
          <CalendarIcon className="w-7 h-7" />
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-apricot hover:text-white shadow-md"
          title="Settings"
        >
          <Cog6ToothIcon className="w-7 h-7" />
        </button>
        <button 
          onClick={() => navigate('/chat')}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-light-orange hover:text-white shadow-md"
          title="Chat with Experts"
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7" />
        </button>

        <button 
          onClick={handleSignOut}
          className="p-3 bg-white/90 rounded-lg transition-all hover:bg-light-coral hover:text-white shadow-md"
          title="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-7 h-7" />
        </button>
      </div>
    </div>
  )
}

export default FloatingNav