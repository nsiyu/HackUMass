import { useNavigate } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface NavbarProps {
  session: Session | null
  setShowAuthModal: (show: boolean) => void
}

const Navbar = ({ session, setShowAuthModal }: NavbarProps) => {
  const navigate = useNavigate()

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 font-oxygen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Flutter</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-light-coral transition-colors">
              For Scientists
            </a>
            <a href="#" className="text-gray-700 hover:text-light-coral transition-colors">
              For Hobbyists
            </a>
            <a href="#" className="text-gray-700 hover:text-light-coral transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-light-coral transition-colors">
              Contact
            </a>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => session ? supabase.auth.signOut() : setShowAuthModal(true)}
              className="px-4 py-2 text-gray-700 hover:text-light-coral transition-colors"
            >
              {session ? 'Sign Out' : 'Sign In'}
            </button>
            <button 
              onClick={() => navigate('/sanctuary')} 
              className="px-4 py-2 bg-light-coral text-white rounded-lg hover:bg-coral-pink transition-colors"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 