export interface AddBirdFormData {
  name: string
  species: string
  location: string
}

export interface Bird {
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