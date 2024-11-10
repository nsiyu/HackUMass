import { FC } from 'react'

const HeroImage: FC = () => {
  return (
    <div className="relative">
      <img
        src="https://img.pikbest.com/origin/10/06/97/57epIkbEsTDyv.jpg!w700wp"
        alt="Crystal Bird"
        className="rounded-lg shadow-2xl w-full h-auto object-cover"
      />
      {/* Optional decorative elements */}
      <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-light-coral rounded-full opacity-20 blur-3xl" />
      <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-melon rounded-full opacity-20 blur-3xl" />
    </div>
  )
}

export default HeroImage 