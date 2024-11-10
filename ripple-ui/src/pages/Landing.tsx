import { FC } from 'react'
import Navbar from '../components/Navbar'
import HeroImage from '../components/HeroImage'
import { Session } from '@supabase/supabase-js'

interface LandingProps {
  session: Session | null
  setShowAuthModal: (show: boolean) => void
}

const Landing: FC<LandingProps> = ({ session, setShowAuthModal }) => {
  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen">
      <Navbar session={session} setShowAuthModal={setShowAuthModal} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">
              AI-powered bird tracking for{' '}
              <span className="underline decoration-light-coral">scientists</span>{' '}
              and{' '}
              <span className="underline decoration-light-coral">enthusiasts</span>
            </h1>
            <p className="text-xl text-gray-700">
              Bridging the gap between ornithological research and hobbyist discoveries through 
              advanced AI recognition technology.
            </p>
          </div>
          <div className="lg:w-1/2">
            <HeroImage />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">For Ornithologists</h3>
            <p className="text-gray-700 mb-6">
              Track and monitor bird species with our advanced AI scanning technology. 
            </p>
            <button 
              onClick={() => !session ? setShowAuthModal(true) : window.location.href = '/research'}
              className="bg-light-coral text-white px-6 py-3 rounded-lg hover:bg-coral-pink transition-colors"
            >
              Start Research
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">For Bird Watchers</h3>
            <p className="text-gray-700 mb-6">
              Contribute to ornithological research with our easy-to-use scanning tools. 
              Build your virtual aviary by identifying and collecting unique species.
            </p>
            <button 
              onClick={() => !session ? setShowAuthModal(true) : window.location.href = '/sanctuary'}
              className="bg-melon text-white px-6 py-3 rounded-lg hover:bg-apricot transition-colors"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing