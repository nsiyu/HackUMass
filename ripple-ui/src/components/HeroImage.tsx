import { FC } from 'react'

const HeroImage: FC = () => {
  return (
    <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden">
      <img
        src="https://cdn.shopify.com/s/files/1/0024/1788/5284/files/clown-fish.jpg"
        alt="Clownfish swimming in anemone"
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-light-coral/10 to-transparent" />
    </div>
  )
}

export default HeroImage 