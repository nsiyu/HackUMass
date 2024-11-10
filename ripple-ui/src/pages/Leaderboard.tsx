import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline'

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  institution: string
  contributions: number
  avatar?: string
}

interface BirdLeaderboard {
  species: string
  topSpotters: LeaderboardEntry[]
}

const Leaderboard: FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'global' | 'species'>('global')
  
  const mockGlobalLeaderboard: LeaderboardEntry[] = [
    { 
      rank: 1, 
      name: "Dr. Li", 
      points: 2450, 
      institution: "Texas A&M University", 
      contributions: 156,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrLi"
    },
    { 
      rank: 2, 
      name: "Sarah Chen", 
      points: 2100, 
      institution: "Cornell University", 
      contributions: 134,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen"
    },
    { 
      rank: 3, 
      name: "Dr. Smith", 
      points: 1950, 
      institution: "University of Washington", 
      contributions: 128,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith"
    }
  ]

  const mockBirdLeaderboards: BirdLeaderboard[] = [
    {
      species: "Hummingbird",
      topSpotters: [
        { rank: 1, name: "Alex Wong", points: 850, institution: "UC Berkeley", contributions: 45 },
        { rank: 2, name: "Maria Garcia", points: 720, institution: "Stanford", contributions: 38 },
        { rank: 3, name: "James Wilson", points: 690, institution: "MIT", contributions: 35 }
      ]
    },
    {
      species: "Blue Jay",
      topSpotters: [
        { rank: 1, name: "Dr. Li", points: 920, institution: "Texas A&M University", contributions: 52 },
        { rank: 2, name: "Sarah Chen", points: 880, institution: "Cornell University", contributions: 44 },
        { rank: 3, name: "Tom Baker", points: 760, institution: "UCLA", contributions: 41 }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen p-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Sanctuary
      </button>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
                Leaderboards
              </h1>
              <p className="text-gray-600">Top contributors in bird spotting and research</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'global' 
                    ? 'bg-light-coral text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Global Rankings
              </button>
              <button
                onClick={() => setActiveTab('species')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'species' 
                    ? 'bg-light-coral text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                By Species
              </button>
            </div>
          </div>

          {activeTab === 'global' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Researcher</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Institution</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Points</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGlobalLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold
                          ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' : ''}
                          ${entry.rank === 2 ? 'bg-gray-100 text-gray-600' : ''}
                          ${entry.rank === 3 ? 'bg-amber-100 text-amber-600' : ''}
                        `}>
                          #{entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {entry.avatar && (
                            <img 
                              src={entry.avatar} 
                              alt={entry.name}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <span className="font-medium">{entry.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{entry.institution}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-light-coral">{entry.points}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{entry.contributions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {mockBirdLeaderboards.map((birdBoard) => (
                <div key={birdBoard.species} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{birdBoard.species}</h3>
                  <div className="space-y-3">
                    {birdBoard.topSpotters.map((spotter) => (
                      <div 
                        key={spotter.rank}
                        className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                            ${spotter.rank === 1 ? 'bg-yellow-100 text-yellow-600' : ''}
                            ${spotter.rank === 2 ? 'bg-gray-100 text-gray-600' : ''}
                            ${spotter.rank === 3 ? 'bg-amber-100 text-amber-600' : ''}
                          `}>
                            {spotter.rank}
                          </span>
                          <div>
                            <p className="font-medium">{spotter.name}</p>
                            <p className="text-sm text-gray-600">{spotter.institution}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-light-coral">{spotter.points} pts</p>
                          <p className="text-sm text-gray-600">{spotter.contributions} spots</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard