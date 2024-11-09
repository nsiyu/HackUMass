const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 font-oxygen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Ripple</span>
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
            <button className="px-4 py-2 text-gray-700 hover:text-light-coral transition-colors">
              Sign in
            </button>
            <button className="px-4 py-2 bg-light-coral text-white rounded-lg hover:bg-coral-pink transition-colors">
              Try Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 