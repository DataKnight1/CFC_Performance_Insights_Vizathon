import { fetchCSV } from "./csv-parser"

export interface PlayerData {
  season: string
  player: string
  nationality: string
  position: string
  age: string
  games: string
  games_starts: string
  minutes: string
  minutes_90s: string
}

// Update the fetchPlayerData function to ensure proper data processing
export async function fetchPlayerData(): Promise<PlayerData[]> {
  const csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fbref_data-1d2bEhiqFPThlxpckuoQhsaLrVdd7X.csv"
  try {
    const data = (await fetchCSV(csvUrl)) as PlayerData[]

    // Clean up the data to ensure all fields are properly formatted
    return data.map((item) => ({
      ...item,
      season: item.season?.trim() || "",
      player: item.player?.trim() || "",
      nationality: item.nationality?.trim() || "",
      position: item.position?.trim() || "",
      age: item.age?.trim() || "",
      games: item.games?.trim() || "0",
      games_starts: item.games_starts?.trim() || "0",
      minutes: item.minutes?.trim() || "0",
      minutes_90s: item.minutes_90s?.trim() || "0",
    }))
  } catch (error) {
    console.error("Error fetching player data:", error)
    return []
  }
}

export function getUniquePlayers(data: PlayerData[]): string[] {
  const players = new Set<string>()
  data.forEach((item) => {
    if (item.player) {
      players.add(item.player)
    }
  })
  return Array.from(players).sort()
}

export function getPlayerTotalGames(data: PlayerData[], playerName: string): number {
  return data
    .filter((item) => item.player === playerName)
    .reduce((total, item) => total + (Number.parseInt(item.games) || 0), 0)
}

export function getPlayerTotalMinutes(data: PlayerData[], playerName: string): number {
  return data
    .filter((item) => item.player === playerName)
    .reduce((total, item) => total + (Number.parseInt(item.minutes) || 0), 0)
}

export function getPlayerData(data: PlayerData[], playerName: string): PlayerData[] {
  return data.filter((item) => item.player === playerName)
}

export function getCountryCode(nationality: string): string {
  if (!nationality) return "unknown"

  // Extract the first part of the nationality (e.g., "eng" from "eng ENG")
  const code = nationality.toLowerCase().split(" ")[0]

  // Map of 3-letter country codes to 2-letter codes for flag API
  const countryCodeMap: Record<string, string> = {
    eng: "gb-eng", // England
    sco: "gb-sct", // Scotland
    wal: "gb-wls", // Wales
    nir: "gb-nir", // Northern Ireland
    esp: "es", // Spain
    fra: "fr", // France
    ger: "de", // Germany
    ita: "it", // Italy
    por: "pt", // Portugal
    bra: "br", // Brazil
    arg: "ar", // Argentina
    usa: "us", // United States
    ned: "nl", // Netherlands
    bel: "be", // Belgium
    den: "dk", // Denmark
    swe: "se", // Sweden
    nor: "no", // Norway
    sui: "ch", // Switzerland
    cro: "hr", // Croatia
    srb: "rs", // Serbia
    pol: "pl", // Poland
    aut: "at", // Austria
    cze: "cz", // Czech Republic
    hun: "hu", // Hungary
    gre: "gr", // Greece
    tur: "tr", // Turkey
    rus: "ru", // Russia
    ukr: "ua", // Ukraine
    jap: "jp", // Japan
    kor: "kr", // South Korea
    aus: "au", // Australia
    can: "ca", // Canada
    mex: "mx", // Mexico
    egy: "eg", // Egypt
    sen: "sn", // Senegal
    nga: "ng", // Nigeria
    mar: "ma", // Morocco
    gha: "gh", // Ghana
    civ: "ci", // Ivory Coast
    cmr: "cm", // Cameroon
    col: "co", // Colombia
    uru: "uy", // Uruguay
    chi: "cl", // Chile
    per: "pe", // Peru
    ecu: "ec", // Ecuador
    ven: "ve", // Venezuela
    par: "py", // Paraguay
    bol: "bo", // Bolivia
    dk: "dk", // Denmark (sometimes used directly)
    de: "de", // Germany (sometimes used directly)
    fr: "fr", // France (sometimes used directly)
    es: "es", // Spain (sometimes used directly)
    it: "it", // Italy (sometimes used directly)
    pt: "pt", // Portugal (sometimes used directly)
  }

  return countryCodeMap[code] || code
}

