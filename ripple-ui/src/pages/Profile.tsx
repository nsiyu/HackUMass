import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const Profile: FC = () => {
  const navigate = useNavigate()
  
  const userStats = {
    totalContributions: 156,
    speciesDiscovered: 12,
    researchPoints: 2450,
    rank: "Marine Explorer",
    joinDate: "2024-01-01",
    name: "Dr. Li",
    title: "Marine Biologist",
    institution: "Texas A&M University"
  }

  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen p-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Aquarium
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start gap-8 mb-8">
            <img 
              src="https://tamuhack.org/static/hh-2024/headshots/webp/li.webp"
              alt="Dr. Li"
              className="w-32 h-32 rounded-full object-cover border-4 border-light-coral"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{userStats.name}</h1>
              <p className="text-gray-600">{userStats.title}</p>
              <p className="text-gray-500 text-sm">{userStats.institution}</p>
              <p className="text-gray-500 text-sm mt-2">Member since {new Date(userStats.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-light-coral/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Research Impact</h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Contributions</span>
                    <span className="font-bold">{userStats.totalContributions}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Species Discovered</span>
                    <span className="font-bold">{userStats.speciesDiscovered}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Research Points</span>
                    <span className="font-bold">{userStats.researchPoints}</span>
                  </p>
                </div>
              </div>

              <div className="bg-melon/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rank Progress</h2>
                <p className="text-lg font-bold text-gray-900 mb-2">{userStats.rank}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-light-coral h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 