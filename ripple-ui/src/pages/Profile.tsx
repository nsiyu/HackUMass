import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  AcademicCapIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/solid'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Badge {
  id: string
  name: string
  category: 'photography' | 'identification' | 'research' | 'community'
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  icon: string
  progress: number
  requirement: number
  description: string
}

const Profile: FC = () => {
  const navigate = useNavigate()
  
  const userStats = {
    totalBirdsSpotted: 156,
    speciesDiscovered: 12,
    researchPoints: 2450,
    rank: "Expert Ornithologist",
    joinDate: "2024-01-01",
    name: "Dr. Li",
    title: "Field Researcher",
    institution: "Texas A&M University",
    nextRankProgress: 75,
    contributions: {
      photos: 45,
      identifications: 89,
      research: 22
    }
  }

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'First to spot a rare species in your area',
      icon: '🦅',
      dateEarned: '2024-02-15',
      rarity: 'legendary'
    },
    {
      id: '2',
      title: 'Bird Whisperer',
      description: 'Successfully identified 50 different species',
      icon: '🔍',
      dateEarned: '2024-02-10',
      rarity: 'epic'
    },
    {
      id: '3',
      title: 'Photography Expert',
      description: 'Uploaded 100 high-quality bird photos',
      icon: '📸',
      dateEarned: '2024-02-01',
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Community Guide',
      description: 'Helped 10 new members with bird identification',
      icon: '🤝',
      dateEarned: '2024-01-20',
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Dawn Patrol',
      description: 'Logged 10 early morning bird sightings',
      icon: '🌅',
      dateEarned: '2024-01-15',
      rarity: 'common'
    },
    {
      id: '6',
      title: 'Research Pioneer',
      description: 'Contributed to 5 research projects',
      icon: '🔬',
      dateEarned: '2024-01-10',
      rarity: 'epic'
    }
  ]

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Bird Photographer',
      category: 'photography',
      level: 'gold',
      icon: '📸',
      progress: 75,
      requirement: 100,
      description: 'Upload high-quality bird photos'
    },
    {
      id: '2',
      name: 'Species Expert',
      category: 'identification',
      level: 'platinum',
      icon: '🔍',
      progress: 100,
      requirement: 100,
      description: 'Identify different bird species'
    },
    {
      id: '3',
      name: 'Research Contributor',
      category: 'research',
      level: 'silver',
      icon: '🔬',
      progress: 45,
      requirement: 100,
      description: 'Contribute to research projects'
    },
    {
      id: '4',
      name: 'Community Leader',
      category: 'community',
      level: 'bronze',
      icon: '🤝',
      progress: 25,
      requirement: 100,
      description: 'Help other bird watchers'
    }
  ]

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getBadgeColor = (level: Badge['level']) => {
    switch (level) {
      case 'platinum': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen p-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Sanctuary
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start gap-8 mb-8">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userStats.name}`}
              alt={userStats.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-light-coral"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{userStats.name}</h1>
                  <p className="text-gray-600">{userStats.title}</p>
                  <p className="text-gray-500 text-sm">{userStats.institution}</p>
                  <p className="text-gray-500 text-sm mt-2">Member since {new Date(userStats.joinDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-light-coral">{userStats.rank}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-light-coral h-2 rounded-full" 
                        style={{ width: `${userStats.nextRankProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{userStats.nextRankProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-light-coral/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bird Watching Stats</h2>
                <div className="grid grid-cols-3 gap-4">
               
                  <div className="text-center p-4 bg-white rounded-lg">
                    <CameraIcon className="w-6 h-6 mx-auto mb-2 text-light-coral" />
                    <p className="text-2xl font-bold">{userStats.contributions.photos}</p>
                    <p className="text-sm text-gray-600">Photos</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <AcademicCapIcon className="w-6 h-6 mx-auto mb-2 text-light-coral" />
                    <p className="text-2xl font-bold">{userStats.researchPoints}</p>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                </div>
              </div>

              <div className="bg-melon/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm">Spotted a rare Hummingbird</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm">Contributed to Blue Jay research</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm">Uploaded 5 new bird photos</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <span className="text-sm text-gray-600">{achievements.length} earned</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border ${getRarityColor(achievement.rarity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className="text-sm">{achievement.description}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          Earned {new Date(achievement.dateEarned).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
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