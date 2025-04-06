"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AnimatedBackground from "../components/animated-background"
import { InfoTooltip } from "../components/info-tooltip"
import { ExportButtons } from "../components/export-buttons"

// No longer using the simplified pitch component

interface PlayerBio {
  id: number
  name: string
  position: string
  number: number
  nationality: string
  height: string
  weight: string
  birthDate: string
  age: number
  preferredFoot: string
  contractUntil: string
  joinedFrom: string
  value: string
  image: string
  flagCode: string
  bio: string
  stats: {
    appearances: number
    goals: number
    assists: number
    cleanSheets?: number
    tackles?: number
    interceptions?: number
    passingAccuracy?: number
    savesPercentage?: number
    aerialsWon?: number
  }
}

export default function Biography() {
  const [players, setPlayers] = useState<PlayerBio[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerBio | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Mock player data for Chelsea FC
  useEffect(() => {
    const mockPlayers: PlayerBio[] = [
      {
        id: 1,
        name: "Robert Sánchez",
        position: "Goalkeeper",
        number: 1,
        nationality: "Spain",
        height: "1.97m",
        weight: "88kg",
        birthDate: "1997-04-18",
        age: 27,
        preferredFoot: "Right",
        contractUntil: "2030-06-30",
        joinedFrom: "Brighton & Hove Albion",
        value: "£25m",
        image: "https://www.zerozero.pt/img/jogadores/new/37/77/483777_robert_sanchez_20240817015740.png",
        flagCode: "es",
        bio: "Robert Sánchez is a Spanish professional footballer who plays as a goalkeeper for Premier League club Chelsea and the Spain national team. Known for his commanding presence, strong distribution skills, and shot-stopping ability, Sánchez joined Chelsea from Brighton in 2023 to become the club's first-choice goalkeeper.",
        stats: {
          appearances: 31,
          goals: 0,
          assists: 0,
          cleanSheets: 9,
          savesPercentage: 72.3
        }
      },
      {
        id: 2,
        name: "Malo Gusto",
        position: "Right-Back",
        number: 27,
        nationality: "France",
        height: "1.76m",
        weight: "72kg",
        birthDate: "2003-05-19",
        age: 21,
        preferredFoot: "Right",
        contractUntil: "2030-06-30",
        joinedFrom: "Lyon",
        value: "£30m",
        image: "https://www.zerozero.pt/img/jogadores/new/82/97/748297_malo_gusto_20240817015111.png",
        flagCode: "fr",
        bio: "Malo Gusto is a French professional footballer who plays as a right-back for Premier League club Chelsea and the France national team. Known for his pace, technical ability, and attacking prowess, Gusto joined Chelsea from Lyon in 2023 and has established himself as a promising young defender.",
        stats: {
          appearances: 28,
          goals: 0,
          assists: 5,
          tackles: 76,
          interceptions: 44,
          passingAccuracy: 84.5
        }
      },
      {
        id: 3,
        name: "Tosin Adarabioyo",
        position: "Center-Back",
        number: 4,
        nationality: "England",
        height: "1.96m",
        weight: "85kg",
        birthDate: "1997-09-24",
        age: 26,
        preferredFoot: "Right",
        contractUntil: "2029-06-30",
        joinedFrom: "Fulham",
        value: "£40m",
        image: "https://www.zerozero.pt/img/jogadores/new/33/55/303355_tosin_adarabioyo_20240817015338.png",
        flagCode: "gb-eng",
        bio: "Tosin Adarabioyo is an English professional footballer who plays as a center-back for Premier League club Chelsea. Known for his aerial dominance, passing ability, and composure on the ball, Adarabioyo joined Chelsea from Fulham in 2024. He began his career at Manchester City's academy before establishing himself in the Premier League.",
        stats: {
          appearances: 14,
          goals: 2,
          assists: 0,
          tackles: 22,
          interceptions: 28,
          aerialsWon: 74
        }
      },
      {
        id: 4,
        name: "Levi Colwill",
        position: "Center-Back",
        number: 26,
        nationality: "England",
        height: "1.87m",
        weight: "80kg",
        birthDate: "2003-02-26",
        age: 22,
        preferredFoot: "Left",
        contractUntil: "2029-06-30",
        joinedFrom: "Chelsea Academy",
        value: "£45m",
        image: "https://www.zerozero.pt/img/jogadores/new/82/41/748241_levi_colwill__20240817014842.png",
        flagCode: "gb-eng",
        bio: "Levi Colwill is an English professional footballer who plays as a center-back for Premier League club Chelsea and the England national team. A product of Chelsea's academy, Colwill spent successful loan spells at Huddersfield Town and Brighton & Hove Albion before becoming a key defender for his parent club. Known for his ball-playing ability, reading of the game, and left-footed distribution.",
        stats: {
          appearances: 26,
          goals: 1,
          assists: 1,
          tackles: 38,
          interceptions: 49,
          passingAccuracy: 90.2
        }
      },
      {
        id: 5,
        name: "Marc Cucurella",
        position: "Left-Back",
        number: 3,
        nationality: "Spain",
        height: "1.72m",
        weight: "70kg",
        birthDate: "1998-07-22",
        age: 26,
        preferredFoot: "Left",
        contractUntil: "2028-06-30",
        joinedFrom: "Brighton & Hove Albion",
        value: "£35m",
        image: "https://www.zerozero.pt/img/jogadores/new/62/32/436232_marc_cucurella_20240817014444.png",
        flagCode: "es",
        bio: "Marc Cucurella is a Spanish professional footballer who plays as a left-back or wing-back for Premier League club Chelsea and the Spain national team. Known for his energy, crossing ability, and versatility, Cucurella joined Chelsea from Brighton in 2022. He has represented Spain at various levels including at the Olympics and senior team.",
        stats: {
          appearances: 52,
          goals: 1,
          assists: 6,
          tackles: 118,
          interceptions: 67,
          passingAccuracy: 85.7
        }
      },
      {
        id: 6,
        name: "Moises Caicedo",
        position: "Defensive Midfielder",
        number: 25,
        nationality: "Ecuador",
        height: "1.78m",
        weight: "74kg",
        birthDate: "2001-11-02",
        age: 23,
        preferredFoot: "Right",
        contractUntil: "2031-06-30",
        joinedFrom: "Brighton & Hove Albion",
        value: "£100m",
        image: "https://www.zerozero.pt/img/jogadores/new/71/55/727155_moises_caicedo_20240817020927.png",
        flagCode: "ec",
        bio: "Moises Caicedo is an Ecuadorian professional footballer who plays as a defensive midfielder for Premier League club Chelsea and the Ecuador national team. Known for his ball-winning abilities, work rate, and technical skills, Caicedo joined Chelsea from Brighton in 2023 for a British record transfer fee. He is considered one of the premier defensive midfielders in the Premier League.",
        stats: {
          appearances: 37,
          goals: 1,
          assists: 2,
          tackles: 104,
          interceptions: 76,
          passingAccuracy: 88.9
        }
      },
      {
        id: 7,
        name: "Enzo Fernández",
        position: "Central Midfielder",
        number: 8,
        nationality: "Argentina",
        height: "1.78m",
        weight: "76kg",
        birthDate: "2001-01-17",
        age: 24,
        preferredFoot: "Right",
        contractUntil: "2032-06-30",
        joinedFrom: "Benfica",
        value: "£100m",
        image: "https://www.zerozero.pt/img/jogadores/new/76/23/697623_enzo_fernandez_20240817021231.png",
        flagCode: "ar",
        bio: "Enzo Fernández is an Argentine professional footballer who plays as a midfielder for Premier League club Chelsea and the Argentina national team. A World Cup winner with Argentina in 2022, Fernández joined Chelsea in January 2023 for a British record transfer fee. He is renowned for his passing range, tactical intelligence, and work rate in midfield.",
        stats: {
          appearances: 63,
          goals: 6,
          assists: 5,
          tackles: 187,
          interceptions: 95,
          passingAccuracy: 91.8
        }
      },
      {
        id: 8,
        name: "Cole Palmer",
        position: "Attacking Midfielder",
        number: 20,
        nationality: "England",
        height: "1.89m",
        weight: "79kg",
        birthDate: "2002-05-06",
        age: 22,
        preferredFoot: "Left",
        contractUntil: "2033-06-30",
        joinedFrom: "Manchester City",
        value: "£120m",
        image: "https://www.zerozero.pt/img/jogadores/new/90/19/659019_cole_palmer_20240817020947.png",
        flagCode: "gb-eng",
        bio: "Cole Palmer is an English professional footballer who plays as an attacking midfielder for Premier League club Chelsea and the England national team. Known for his excellent close control, passing range, and eye for goal, Palmer joined Chelsea from Manchester City in 2023 and quickly established himself as a star player. His debut season saw him score over 20 Premier League goals.",
        stats: {
          appearances: 45,
          goals: 25,
          assists: 15,
          passingAccuracy: 86.2
        }
      },
      {
        id: 9,
        name: "Christopher Nkunku",
        position: "Forward",
        number: 18,
        nationality: "France",
        height: "1.75m",
        weight: "73kg",
        birthDate: "1997-11-14",
        age: 27,
        preferredFoot: "Right",
        contractUntil: "2029-06-30",
        joinedFrom: "RB Leipzig",
        value: "£60m",
        image: "https://www.zerozero.pt/img/jogadores/new/51/16/425116_christopher_nkunku_20240817020636.png",
        flagCode: "fr",
        bio: "Christopher Nkunku is a French professional footballer who plays as a forward for Premier League club Chelsea and the France national team. Known for his versatility, technical ability, and goal-scoring prowess, Nkunku joined Chelsea from RB Leipzig in 2023. He previously played for Paris Saint-Germain and was named Bundesliga Player of the Season in 2021-22.",
        stats: {
          appearances: 28,
          goals: 8,
          assists: 4,
          passingAccuracy: 83.1
        }
      },
      {
        id: 10,
        name: "Pedro Neto",
        position: "Winger",
        number: 7,
        nationality: "Portugal",
        height: "1.77m",
        weight: "70kg",
        birthDate: "2000-03-09",
        age: 25,
        preferredFoot: "Left",
        contractUntil: "2029-06-30",
        joinedFrom: "Wolverhampton Wanderers",
        value: "£55m",
        image: "https://www.zerozero.pt/img/jogadores/new/64/69/296469_pedro_neto_20250321120254.png",
        flagCode: "pt",
        bio: "Pedro Neto is a Portuguese professional footballer who plays as a winger for Premier League club Chelsea and the Portugal national team. Known for his explosive pace, dribbling ability, and creativity, Neto joined Chelsea from Wolverhampton Wanderers in 2024. Despite battling injuries during his career, his talent and potential have made him one of the most exciting wide players in English football.",
        stats: {
          appearances: 12,
          goals: 3,
          assists: 5,
          passingAccuracy: 82.7
        }
      },
      {
        id: 11,
        name: "Nicolas Jackson",
        position: "Striker",
        number: 15,
        nationality: "Senegal",
        height: "1.86m",
        weight: "80kg",
        birthDate: "2001-06-20",
        age: 23,
        preferredFoot: "Right",
        contractUntil: "2031-06-30",
        joinedFrom: "Villarreal",
        value: "£55m",
        image: "https://www.zerozero.pt/img/jogadores/new/78/26/827826_nicolas_jackson_20240817020748.png",
        flagCode: "sn",
        bio: "Nicolas Jackson is a Senegalese professional footballer who plays as a striker for Premier League club Chelsea and the Senegal national team. Known for his pace, movement, and finishing ability, Jackson joined Chelsea in 2023 from Villarreal and has become the club's primary center-forward option. His first season saw him score impressive goals despite criticism over missed chances.",
        stats: {
          appearances: 43,
          goals: 17,
          assists: 6,
          aerialsWon: 124
        }
      }
    ]
    
    setPlayers(mockPlayers)
    setSelectedPlayer(mockPlayers[0]) // Set the first player as default
    setLoading(false)
  }, [])
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  
  function calculateAge(birthDate: string): number {
    const birthday = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthday.getFullYear()
    const monthDifference = today.getMonth() - birthday.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bring_your_boots_tour_2025_header-s6bQPBCt2XFNbuZXnTP1CH2zcSEnnq.webp"
          alt="Chelsea FC Stadium"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#070E16]/80"></div>
      </div>

      {/* Animated Background with Football Elements */}
      <AnimatedBackground />

      <header className="container mx-auto py-6 px-4 z-10">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-chelsea-gradient rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
                  alt="Chelsea FC Logo"
                  width={40}
                  height={40}
                  className="mr-3"
                />
              </div>
            </div>
            <span className="text-white text-lg font-bold">CFC Performance Insights</span>
          </Link>
          <nav>
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link 
                  href="/load-demand" 
                  className="text-white hover:text-[#1E54B7] transition-colors relative group"
                >
                  <span>Load Demand</span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/injury-history" 
                  className="text-white hover:text-[#1E54B7] transition-colors relative group"
                >
                  <span>Injury History</span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/physical-development" 
                  className="text-white hover:text-[#1E54B7] transition-colors relative group"
                >
                  <span>Physical Development</span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/biography" 
                  className="text-[#1E54B7] font-medium relative"
                >
                  <span>Biography</span>
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-chelsea-gradient"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/recovery" 
                  className="text-white hover:text-[#1E54B7] transition-colors relative group"
                >
                  <span>Recovery</span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/external-factors" 
                  className="text-white hover:text-[#1E54B7] transition-colors relative group"
                >
                  <span>External Factors</span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-chelsea-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
            <button className="md:hidden text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--heading-font)" }}>
                <span className="inline-block">
                  Player Biography
                  <div className="h-1 w-1/3 bg-chelsea-gradient mt-1"></div>
                </span>
              </h1>
              <div className="text-gray-300 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Detailed player profiles and career information 
                <InfoTooltip text="View comprehensive player details including personal information, career statistics, and contract details." />
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <ExportButtons data={players} filename="player_profiles.csv" buttonText="Export Profiles" />
            </div>
          </div>

          {/* Team Overview section removed as requested */}

          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-[#1E54B7] border-r-transparent border-b-[#034694] border-l-transparent"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image 
                    src="https://img.icons8.com/ios-filled/50/FFFFFF/football2.png"
                    alt="Football"
                    width={20}
                    height={20}
                    className="opacity-70"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Player Selection */}
              <div className="lg:col-span-3">
                <div className="chelsea-card p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Squad Players
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 field-pattern">
                    {players.map(player => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                          selectedPlayer?.id === player.id 
                            ? 'bg-chelsea-gradient-light border border-[#1E54B7]/50 shadow-[0_0_10px_rgba(30,84,183,0.2)]' 
                            : 'bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-[#1E54B7]/30'
                        }`}
                      >
                        <div className={`w-12 h-12 relative mr-3 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 ${selectedPlayer?.id === player.id ? 'ring-2 ring-[#1E54B7]' : ''}`}>
                          <Image
                            src={player.image}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className={`font-medium ${selectedPlayer?.id === player.id ? 'text-[#1E54B7]' : 'text-white'}`}>
                            {player.name}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mr-2">{player.position}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full text-white ${selectedPlayer?.id === player.id ? 'bg-[#1E54B7]' : 'bg-gray-700'}`}>
                              {player.number}
                            </span>
                          </div>
                        </div>
                        {selectedPlayer?.id === player.id && (
                          <div className="ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 12 6 6 8-10"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Details */}
              <div className="lg:col-span-9">
                {selectedPlayer && (
                  <>
                    <div className="chelsea-card p-6 md:p-8 rounded-lg mb-8 animate-fadeIn">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 h-[350px] md:h-auto mb-6 md:mb-0 rounded-xl overflow-hidden group">
                          {/* Player Image */}
                          <div className="absolute inset-0 bg-chelsea-gradient opacity-30 group-hover:opacity-20 transition-opacity"></div>
                          <Image
                            src={selectedPlayer.image}
                            alt={selectedPlayer.name}
                            fill
                            className="object-cover rounded-xl object-top"
                            priority
                          />
                          
                          {/* Football position graphic overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-chelsea-gradient flex items-center justify-center mr-3">
                                <span className="text-xl font-bold text-white">{selectedPlayer.number}</span>
                              </div>
                              <div>
                                <p className="text-white font-semibold">{selectedPlayer.position}</p>
                                <p className="text-xs text-gray-300">{selectedPlayer.preferredFoot} Foot</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Player nationality flag */}
                          <div className="absolute top-4 right-4 flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <div className="relative w-5 h-3.5 overflow-hidden rounded mr-2">
                              <Image
                                src={`https://flagcdn.com/w80/${selectedPlayer.flagCode.toLowerCase()}.png`}
                                alt={`${selectedPlayer.nationality} flag`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs text-white">{selectedPlayer.nationality}</span>
                          </div>
                        </div>
                        
                        <div className="md:pl-8 md:w-2/3">
                          <div className="flex items-center mb-4">
                            <h2 className="text-3xl font-bold text-white mr-4" style={{ fontFamily: "var(--heading-font)" }}>
                              {selectedPlayer.name}
                            </h2>
                            <div className="flex items-center">
                              <div className="px-2 py-1 rounded bg-[#1E54B7]/20 border border-[#1E54B7]/40 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <path d="M5.8 11.3 2 22l10.7-3.79"></path>
                                  <path d="M4 3h.01"></path>
                                  <path d="M22 8h.01"></path>
                                  <path d="M15 2h.01"></path>
                                  <path d="M22 20h.01"></path>
                                  <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
                                  <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
                                  <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
                                  <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
                                </svg>
                                <span className="text-xs font-medium text-[#1E54B7]">First Team</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bio with quote styling */}
                          <div className="relative mb-6 pl-4 border-l-2 border-[#1E54B7]">
                            <p className="text-gray-300 text-sm leading-relaxed">{selectedPlayer.bio}</p>
                          </div>
                          
                          {/* Player attributes in a card grid with icons */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                    <path d="M3 9h18"></path>
                                    <path d="M9 21V9"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Position</p>
                                  <p className="text-white text-sm font-medium">{selectedPlayer.position}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                    <path d="M12 8v4l3 3"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Birth Date</p>
                                  <p className="text-white text-sm font-medium">{formatDate(selectedPlayer.birthDate)}</p>
                                  <p className="text-xs text-gray-400">{selectedPlayer.age} years</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Height / Weight</p>
                                  <p className="text-white text-sm font-medium">{selectedPlayer.height} / {selectedPlayer.weight}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12h5"></path>
                                    <path d="M17 12h5"></path>
                                    <path d="M7 12a5 5 0 0 1 5-5"></path>
                                    <path d="M12 17a5 5 0 0 1-5-5"></path>
                                    <path d="M12 7v10"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Preferred Foot</p>
                                  <p className="text-white text-sm font-medium">{selectedPlayer.preferredFoot}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Joined From</p>
                                  <p className="text-white text-sm font-medium">{selectedPlayer.joinedFrom}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-[#1E54B7]/30 transition">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-md bg-[#1E54B7]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20"></path>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Market Value</p>
                                  <p className="text-white text-sm font-medium">{selectedPlayer.value}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="chelsea-card p-6 rounded-lg">
                        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M12 20V10"></path>
                            <path d="M18 20V4"></path>
                            <path d="M6 20v-4"></path>
                          </svg>
                          Career Statistics
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-800/60 p-4 rounded-lg text-center border border-gray-700">
                            <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--heading-font)" }}>
                              {selectedPlayer.stats.appearances}
                            </p>
                            <div className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M17 9V5a3 3 0 0 0-6 0v4"></path>
                                <rect width="18" height="16" x="3" y="8" rx="2"></rect>
                                <circle cx="12" cy="16" r="1"></circle>
                              </svg>
                              <p className="text-xs text-gray-300">Appearances</p>
                            </div>
                          </div>
                          <div className="bg-gray-800/60 p-4 rounded-lg text-center border border-gray-700">
                            <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--heading-font)" }}>
                              {selectedPlayer.stats.goals}
                            </p>
                            <div className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              <p className="text-xs text-gray-300">Goals</p>
                            </div>
                          </div>
                          <div className="bg-gray-800/60 p-4 rounded-lg text-center border border-gray-700">
                            <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--heading-font)" }}>
                              {selectedPlayer.stats.assists}
                            </p>
                            <div className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M16 21h3c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 1H7c-.5 0-1 .2-1.4.6C5.2 2 5 2.5 5 3v4"></path>
                                <path d="M14 1v5c0 .5.2 1 .6 1.4.4.4.9.6 1.4.6h5"></path>
                                <g>
                                  <path d="M5 12v6"></path>
                                  <path d="M15 12v6"></path>
                                  <path d="M10 18a5 5 0 0 1-5-5"></path>
                                  <path d="M10 18a5 5 0 0 0 5-5"></path>
                                  <path d="M10 18V9"></path>
                                </g>
                              </svg>
                              <p className="text-xs text-gray-300">Assists</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {selectedPlayer.stats.cleanSheets !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                  <span className="text-sm text-gray-300">Clean Sheets</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.cleanSheets}</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${Math.min(selectedPlayer.stats.cleanSheets / selectedPlayer.stats.appearances * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlayer.stats.savesPercentage !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="m9 11-6 6v3h9l3-3"></path>
                                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path>
                                    <path d="m5 19 2 2"></path>
                                  </svg>
                                  <span className="text-sm text-gray-300">Save Percentage</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.savesPercentage}%</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${selectedPlayer.stats.savesPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlayer.stats.passingAccuracy !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M10 9H4L2 7l2-2h6"></path>
                                    <path d="M14 5h6l2 2-2 2h-6"></path>
                                    <path d="M10 19H4l-2-2 2-2h6"></path>
                                    <path d="M14 15h6l2 2-2 2h-6"></path>
                                  </svg>
                                  <span className="text-sm text-gray-300">Passing Accuracy</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.passingAccuracy}%</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${selectedPlayer.stats.passingAccuracy}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlayer.stats.tackles !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M10 16.5c0-1-1.5-2-1.5-2l-3 4c0 .5.5 1 1 1h3.5Z"></path>
                                    <path d="m17 2 5 5-3 3c-3-3-5.5-5.5-8.5-8.5"></path>
                                    <path d="M7 11.5c0-1-1.5-2-1.5-2"></path>
                                    <path d="M10.5 15.5c.5.5 2 1.5 3 .5s1-2 .5-3-2-1.5-3-1-1.5 2-1 3Z"></path>
                                    <path d="M19 9.5 16 11c-.5.5-2 1.5-3 .5s-1-2-.5-3c.5-1 2-1.5 3-1l1.5-2.5"></path>
                                    <path d="M5 19.5c1-1 4-3 5-3 1.5 0 3 1 4 2s2 3 2 4c0 1.5-5 1.5-7 0s-3-2-4-3Z"></path>
                                  </svg>
                                  <span className="text-sm text-gray-300">Tackles</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.tackles}</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${Math.min(selectedPlayer.stats.tackles / 300 * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlayer.stats.interceptions !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M21.73 18.93c-1 1.84-3.85 1-6.43-1.96-2.96-3.38-3.17-7.45-1.66-9.38"></path>
                                    <path d="M2.27 5.07c1-1.84 3.85-1 6.43 1.96 2.96 3.38 3.17 7.45 1.66 9.38"></path>
                                    <path d="m9.17 9.17-7.07-7.07"></path>
                                    <path d="m21.9 21.9-7.07-7.07"></path>
                                  </svg>
                                  <span className="text-sm text-gray-300">Interceptions</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.interceptions}</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${Math.min(selectedPlayer.stats.interceptions / 200 * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlayer.stats.aerialsWon !== undefined && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M20 22v-6l-4-2-1-4 4.14-.4a2 2 0 0 0 1.71-1.92 2 2 0 0 0-2-1.68H9a2 2 0 0 0-2 2v6l-3 4.48a2 2 0 0 0-.15 2.16 2 2 0 0 0 1.84.86H18"></path>
                                    <path d="M7 10v4"></path>
                                    <path d="M17 10v4"></path>
                                  </svg>
                                  <span className="text-sm text-gray-300">Aerials Won</span>
                                </div>
                                <span className="text-sm text-white font-medium">{selectedPlayer.stats.aerialsWon}</span>
                              </div>
                              <div className="chelsea-progress-bar">
                                <div
                                  className="chelsea-progress-fill"
                                  style={{ width: `${Math.min(selectedPlayer.stats.aerialsWon / 150 * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="chelsea-card p-6 rounded-lg">
                        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M12.5 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-5"></path>
                            <path d="m18 9-4.35-2.2A3 3 0 0 0 12 6.6V19"></path>
                            <path d="m6.5 15 4.35-2.2a3 3 0 0 1 1.65-.3"></path>
                            <path d="M3.5 10h4a1.5 1.5 0 0 0 0-3h-4a1.5 1.5 0 0 0 0 3Z"></path>
                            <path d="M3.5 17h4a1.5 1.5 0 0 0 0-3h-4a1.5 1.5 0 0 0 0 3Z"></path>
                          </svg>
                          Contract Information
                        </h3>
                        <div className="space-y-6">
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                  <path d="M16 2v4"></path>
                                  <path d="M8 2v4"></path>
                                  <path d="M3 10h18"></path>
                                  <path d="M8 14h.01"></path>
                                  <path d="M12 14h.01"></path>
                                  <path d="M16 14h.01"></path>
                                  <path d="M8 18h.01"></path>
                                  <path d="M12 18h.01"></path>
                                  <path d="M16 18h.01"></path>
                                </svg>
                                <p className="text-white font-medium">Contract Expires</p>
                              </div>
                              <p className="text-white font-semibold">{formatDate(selectedPlayer.contractUntil)}</p>
                            </div>
                            <div className="chelsea-progress-bar mt-2 mb-1">
                              <div
                                className="chelsea-progress-fill"
                                style={{ 
                                  width: `${Math.max(0, Math.min(100, 
                                    ((new Date(selectedPlayer.contractUntil).getTime() - new Date().getTime()) / 
                                    (1000 * 60 * 60 * 24 * 365) / 8) * 100
                                  ))}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-end">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M12 8v4l3 3"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                              <p className="text-xs text-gray-300">
                                {Math.max(0, Math.round((new Date(selectedPlayer.contractUntil).getTime() - new Date().getTime()) / 
                                (1000 * 60 * 60 * 24 * 30)))} months remaining
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M2 17a5 5 0 0 1 10 0"></path>
                                  <path d="M7 17a5 5 0 0 1 10 0"></path>
                                  <path d="M12 17a5 5 0 0 1 10 0"></path>
                                  <path d="M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"></path>
                                  <path d="M17 7a5 5 0 1 1-10 0"></path>
                                </svg>
                                <p className="text-white font-medium">Market Value</p>
                              </div>
                              <p className="text-white font-semibold bg-[#1E54B7]/20 px-2 py-0.5 rounded text-sm">{selectedPlayer.value}</p>
                            </div>
                            <div className="chelsea-progress-bar mt-2 mb-1">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                                style={{ width: `75%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="m5 12 7-7 7 7"></path>
                                <path d="M12 19V5"></path>
                              </svg>
                              <span>+15% since joining</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <p className="text-white font-medium">Chelsea Career</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-gray-800/80 p-2 rounded">
                                <span className="text-gray-300 text-sm">Joined</span>
                                <span className="text-white text-sm font-medium">2022</span>
                              </div>
                              <div className="flex items-center justify-between bg-gray-800/80 p-2 rounded">
                                <span className="text-gray-300 text-sm">Transfer Fee</span>
                                <span className="text-white text-sm font-medium">£35M</span>
                              </div>
                              <div className="flex items-center justify-between bg-gray-800/80 p-2 rounded">
                                <span className="text-gray-300 text-sm">Previous Club</span>
                                <span className="text-white text-sm font-medium">{selectedPlayer.joinedFrom}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="chelsea-card p-6 rounded-lg">
                      <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E54B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        Season Performance
                      </h3>
                      <div className="overflow-x-auto field-pattern">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Competition</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Apps</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Goals</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Assists</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Yellow Cards</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Red Cards</th>
                              <th className="py-2 px-3 text-xs font-medium text-gray-300">Minutes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-sm text-white">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-[#3D195B] mr-2"></div>
                                  Premier League
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">32</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.goals > 5 ? Math.round(selectedPlayer.stats.goals * 0.7) : 1}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.assists > 5 ? Math.round(selectedPlayer.stats.assists * 0.6) : 2}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-yellow-500/20 text-yellow-500 w-6 h-6 rounded-full">4</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-red-500/10 text-red-500 w-6 h-6 rounded-full">0</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">2,731</td>
                            </tr>
                            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-sm text-white">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-[#0E1E5B] mr-2"></div>
                                  Champions League
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">10</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.goals > 5 ? Math.round(selectedPlayer.stats.goals * 0.2) : 0}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.assists > 5 ? Math.round(selectedPlayer.stats.assists * 0.3) : 1}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-yellow-500/20 text-yellow-500 w-6 h-6 rounded-full">2</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-red-500/10 text-red-500 w-6 h-6 rounded-full">0</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">810</td>
                            </tr>
                            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-sm text-white">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-[#DB0048] mr-2"></div>
                                  FA Cup
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">6</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.goals > 5 ? Math.round(selectedPlayer.stats.goals * 0.05) : 0}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.assists > 5 ? Math.round(selectedPlayer.stats.assists * 0.05) : 0}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-yellow-500/20 text-yellow-500 w-6 h-6 rounded-full">1</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-red-500/10 text-red-500 w-6 h-6 rounded-full">0</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">450</td>
                            </tr>
                            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-sm text-white">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-[#025169] mr-2"></div>
                                  League Cup
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">5</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.goals > 5 ? Math.round(selectedPlayer.stats.goals * 0.05) : 0}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">{selectedPlayer.stats.assists > 5 ? Math.round(selectedPlayer.stats.assists * 0.05) : 0}</td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-yellow-500/20 text-yellow-500 w-6 h-6 rounded-full">0</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">
                                <span className="inline-flex items-center justify-center bg-red-500/10 text-red-500 w-6 h-6 rounded-full">0</span>
                              </td>
                              <td className="py-2.5 px-3 text-sm text-gray-300">360</td>
                            </tr>
                          </tbody>
                          <tfoot className="bg-gray-800/40">
                            <tr>
                              <td className="py-3 px-3 text-sm font-medium text-white">Total</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">53</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">{selectedPlayer.stats.goals}</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">{selectedPlayer.stats.assists}</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">7</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">0</td>
                              <td className="py-3 px-3 text-sm font-medium text-white">4,351</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 z-10 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png"
                  alt="Chelsea FC Logo"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-white font-semibold">CFC Performance</span>
              </div>
              <p className="text-gray-400 text-sm">
                Supporting peak athletic performance through data-driven insights
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/load-demand" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Load</Link>
                <Link href="/injury-history" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Injuries</Link>
                <Link href="/physical-development" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Development</Link>
                <Link href="/biography" className="text-[#1E54B7] text-sm">Biography</Link>
                <Link href="/recovery" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">Recovery</Link>
                <Link href="/external-factors" className="text-gray-400 text-sm hover:text-[#1E54B7] transition">External</Link>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="text-white font-medium mb-3">About</h4>
              <p className="text-gray-400 text-sm">
                Performance Insights Vizathon - © {new Date().getFullYear()} Chelsea Football Club
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-6 text-center">
            <p className="text-gray-500 text-xs">
              All rights reserved. Chelsea FC and the Chelsea FC badge are registered trademarks of Chelsea FC Ltd.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}