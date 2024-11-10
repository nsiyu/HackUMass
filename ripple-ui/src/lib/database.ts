import { supabase } from "./supabase";
import type { Bird } from "../types/bird";

export const DEFAULT_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "visitor@birdsanctuary.com",
  name: "Sanctuary Visitor",
};

export async function addBird(birdData: Omit<Bird, "id">) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No session");

  // Upload image and get species prediction
  let imageUrl = null;
  let predictedSpecies = birdData.species; // Default to provided species

  if (birdData.image) {
    const fileExt = birdData.image.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `birds/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("bird-images")
      .upload(filePath, birdData.image);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("bird-images").getPublicUrl(filePath);

    imageUrl = publicUrl;

    // Get species prediction from ML endpoint
    try {
      const formData = new FormData();
      formData.append("file", birdData.image);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const prediction = await response.json();
        predictedSpecies = prediction.predicted_class;
      }
    } catch (error) {
      console.error("Failed to predict species:", error);
      // Continue with user-provided species if prediction fails
    }
  }

  // First, ensure user has a profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    // Create profile if it doesn't exist
    const { error: createProfileError } = await supabase
      .from("profiles")
      .insert({
        id: session.user.id,
        username: session.user.email?.split("@")[0] || "anonymous",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
      });

    if (createProfileError) throw createProfileError;
  }

  const dbBird = {
    name: birdData.name,
    species: predictedSpecies,
    date_added: birdData.dateAdded,
    length: birdData.length,
    pos_x: birdData.pos[0],
    pos_y: birdData.pos[1],
    pos_z: birdData.pos[2],
    speed: birdData.speed,
    radius: birdData.radius,
    color: birdData.color,
    size: birdData.size,
    user_id: session.user.id,
    image_url: imageUrl,
  };

  const { data: bird, error: birdError } = await supabase
    .from("birds")
    .insert(dbBird)
    .select()
    .single();

  if (birdError) throw birdError;

  const { data: sighting, error: sightingError } = await supabase
    .from("bird_sightings")
    .insert({
      bird_id: bird.id,
      spotted_by: session.user.id,
      spotted_at: birdData.lastSpotted.date,
      location_name: birdData.lastSpotted.location.name,
      latitude: birdData.lastSpotted.location.lat,
      longitude: birdData.lastSpotted.location.lng,
    })
    .select(
      `
      *,
      profiles (
        id,
        username,
        avatar_url
      )
    `
    )
    .single();

  if (sightingError) throw sightingError;

  return transformBirdData({
    ...bird,
    latest_sighting: sighting,
  });
}

export async function getBirds() {
  // Get all birds with their latest sighting
  const { data: birds, error: birdsError } = await supabase
    .from("birds")
    .select(
      `
      *,
      bird_sightings (
        spotted_at,
        location_name,
        latitude,
        longitude,
        spotted_by,
        profiles (
          id,
          username,
          avatar_url
        )
      )
    `
    )
    .order("date_added", { ascending: false });

  if (birdsError) throw birdsError;

  return birds.map((bird) => {
    const latestSighting = bird.bird_sightings.reduce(
      (latest: any, current: any) => {
        return !latest ||
          new Date(current.spotted_at) > new Date(latest.spotted_at)
          ? current
          : latest;
      },
      null
    );

    return transformBirdData({
      ...bird,
      latest_sighting: latestSighting,
    });
  });
}

// Helper function to transform database bird to frontend bird type
function transformBirdData(dbBird: any): Bird {
  // Generate random spawn position within a reasonable radius
  const spawnRadius = 30;
  const randomAngle = Math.random() * Math.PI * 2;
  const randomRadius = Math.random() * spawnRadius;
  const spawnX = Math.cos(randomAngle) * randomRadius;
  const spawnZ = Math.sin(randomAngle) * randomRadius;

  return {
    id: dbBird.id,
    name: dbBird.name,
    species: dbBird.species,
    dateAdded: dbBird.date_added,
    length: dbBird.length,
    pos: [spawnX, 2, spawnZ], // Random position instead of stored position
    speed: dbBird.speed,
    radius: dbBird.radius,
    color: dbBird.color,
    size: dbBird.size,
    lastSpotted: {
      date: dbBird.latest_sighting.spotted_at,
      location: {
        lat: dbBird.latest_sighting.latitude,
        lng: dbBird.latest_sighting.longitude,
        name: dbBird.latest_sighting.location_name,
      },
      spottedBy: {
        id: dbBird.latest_sighting.profiles.id,
        name: dbBird.latest_sighting.profiles.username,
        avatar: dbBird.latest_sighting.profiles.avatar_url,
      },
    },
  };
}
