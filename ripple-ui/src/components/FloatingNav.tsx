import { FC } from 'react'
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const FloatingNav: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed left-6 top-6 flex flex-col gap-4 z-50">
      <button
        onClick={() => navigate('/profile')}
        className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
        title="Profile"
      >
        <UserCircleIcon className="h-6 w-6 text-gray-600" />
      </button>
      <button
        onClick={() => navigate('/settings')}
        className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
        title="Settings"
      >
        <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
      </button>
      <button
        onClick={() => navigate('/')}
        className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
        title="Logout"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  )
}

export default FloatingNav 