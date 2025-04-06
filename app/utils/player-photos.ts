// This file contains paths to player photos
// Replace these URLs with your own player photos when implementing

const playerPhotos: Record<string, string> = {
  // Chelsea FC Players - Add your own player images here
  "Reece James": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2023-24/James_Profile_23-24_with_captain_badge",
  "Cole Palmer": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/chelsea-production/media/lbdjw4knnmlz0iwzacka",
  "Robert Sánchez": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2023-24/Sanchez_profile_23-24",
  "Enzo Fernández": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2023-24/Fernandez_Profile_23-24",
  "Mykhailo Mudryk": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2022-23/Mudryk_profile_22-23",
  "Nicolas Jackson": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2023-24/Jackson_profile_23-24",
  "Wesley Fofana": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2022-23/Fofana_profile_22-23",
  "Romeo Lavia": "https://res.cloudinary.com/chelsea-production/image/upload/c_fill,h_630,w_1200/v1/editorial/people/first-team/2023-24/Lavia_profile_23-24",

  // Default placeholder for missing players
  "default": "/placeholder-user.jpg"
};

export function getPlayerPhoto(playerName: string): string {
  // Return the player's photo URL if available, otherwise return the default
  return playerPhotos[playerName] || playerPhotos.default;
}

export default playerPhotos;