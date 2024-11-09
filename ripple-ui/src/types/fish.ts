export interface Fish {
  id: string
  name: string
  species: string
  dateAdded: string
  length: number
  pos: [number, number, number]
  speed: number
  radius: number
  color: string
  size: number
  lastSpotted: {
    date: string
    location: {
      lat: number
      lng: number
      name: string
    }
    spottedBy: {
      id: string
      name: string
      avatar?: string
    }
  }
} 