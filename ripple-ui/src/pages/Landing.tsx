import { FC } from 'react'
import Navbar from '../components/Navbar'
import HeroImage from '../components/HeroImage'

const Landing: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl font-bold text-gray-900">
              AI-powered fish tracking for{' '}
              <span className="underline decoration-light-coral">scientists</span>{' '}
              and{' '}
              <span className="underline decoration-light-coral">enthusiasts</span>
            </h1>
            <p className="text-xl text-gray-700">
              Bridging the gap between marine research and hobbyist discoveries through 
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
            <h3 className="text-2xl font-bold mb-4">For Marine Biologists</h3>
            <p className="text-gray-700 mb-6">
              Track and monitor marine life with our advanced AI scanning technology. 
              Get real-time updates when your tagged fish are spotted in the wild.
            </p>
            <button className="bg-light-coral text-white px-6 py-3 rounded-lg 
              hover:bg-coral-pink transition-colors">
              Start Research
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">For Hobbyists</h3>
            <p className="text-gray-700 mb-6">
              Contribute to marine research while building your virtual aquarium. 
              Scan and identify fish to add them to your personal collection.
            </p>
            <button 
              onClick={() => window.location.href = '/aquarium'} 
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