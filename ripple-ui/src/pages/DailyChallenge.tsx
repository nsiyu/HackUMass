import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
  progress?: {
    current: number
    total: number
  }
}

const DailyChallenge: FC = () => {
  const navigate = useNavigate()
  
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Early Bird',
      description: 'Spot 3 different birds before noon',
      points: 150,
      completed: false,
      progress: {
        current: 1,
        total: 3
      }
    },
    {
      id: '2',
      title: 'Rare Sighting',
      description: 'Find and document a Hummingbird',
      points: 300,
      completed: false
    },
    {
      id: '3',
      title: 'Bird Photographer',
      description: 'Upload 5 high-quality bird photos',
      points: 200,
      completed: true,
      progress: {
        current: 5,
        total: 5
      }
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-coral font-oxygen p-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Sanctuary
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Challenges</h1>
              <p className="text-gray-600">Complete challenges to earn points and rewards</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className="text-xl font-bold text-light-coral">12:45:30</p>
            </div>
          </div>

          <div className="space-y-4">
            {challenges.map(challenge => (
              <div 
                key={challenge.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  challenge.completed 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-light-coral hover:border-coral-pink'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                    {challenge.progress && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                challenge.completed ? 'bg-green-500' : 'bg-light-coral'
                              }`}
                              style={{ 
                                width: `${(challenge.progress.current / challenge.progress.total) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {challenge.progress.current}/{challenge.progress.total}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-light-coral">
                      {challenge.points} pts
                    </span>
                    {challenge.completed && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyChallenge 