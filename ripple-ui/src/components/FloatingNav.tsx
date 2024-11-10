import { FC } from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  ChartBarIcon,
  BookmarkIcon,
  BellIcon,
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
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Profile"
        >
          <UserCircleIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Settings"
        >
          <Cog6ToothIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
        <button 
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Statistics"
        >
          <ChartBarIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
        <button 
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Saved"
        >
          <BookmarkIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
        <button 
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Notifications"
        >
          <BellIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
        <button 
          onClick={handleSignOut}
          className="p-3 bg-white/90 border-2 border-light-coral rounded-lg transition-all hover:bg-coral-pink hover:border-coral-pink group"
          title="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-7 h-7 text-light-coral group-hover:text-white" />
        </button>
      </div>
    </div>
  )
}

export default FloatingNav