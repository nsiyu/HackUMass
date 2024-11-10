export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      birds: {
        Row: {
          id: string
          name: string
          species: string
          date_added: string
          length: number
          pos_x: number
          pos_y: number
          pos_z: number
          speed: number
          radius: number
          color: string
          size: number
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          species: string
          date_added?: string
          length: number
          pos_x: number
          pos_y: number
          pos_z: number
          speed: number
          radius: number
          color: string
          size: number
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          species?: string
          date_added?: string
          length?: number
          pos_x?: number
          pos_y?: number
          pos_z?: number
          speed?: number
          radius?: number
          color?: string
          size?: number
          user_id?: string
        }
      }
      bird_sightings: {
        Row: {
          id: string
          bird_id: string
          spotted_by: string
          spotted_at: string
          location_name: string
          latitude: number
          longitude: number
        }
        Insert: {
          id?: string
          bird_id: string
          spotted_by: string
          spotted_at?: string
          location_name: string
          latitude: number
          longitude: number
        }
        Update: {
          id?: string
          bird_id?: string
          spotted_by?: string
          spotted_at?: string
          location_name?: string
          latitude?: number
          longitude?: number
        }
      }
    }
  }
} 