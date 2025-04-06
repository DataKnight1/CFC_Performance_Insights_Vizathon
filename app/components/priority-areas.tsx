import { fetchCSV } from "../utils/csv-parser"

interface PriorityArea {
  Priority: string
  Category: string
  Area: string
  Target: string
  "Performance Type": string
  "Target set": string
  "Review Date": string
  Tracking: string
}

export async function PriorityAreas() {
  const csvUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CFC%20Individual%20Priority%20Areas-oZavAdSyjLngpfGhRBvN6k0k5f2EhZ.csv"
  const data = (await fetchCSV(csvUrl)) as PriorityArea[]

  // Group data by category for analysis
  const categoryCounts: Record<string, number> = {}
  const trackingStatus: Record<string, number> = {}

  data.forEach((item) => {
    // Count by category
    categoryCounts[item.Category] = (categoryCounts[item.Category] || 0) + 1

    // Count by tracking status
    trackingStatus[item.Tracking] = (trackingStatus[item.Tracking] || 0) + 1
  })

  // Sort data by priority
  const sortedData = [...data].sort((a, b) => {
    return Number.parseInt(a.Priority) - Number.parseInt(b.Priority)
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">Priority Areas by Category</h4>
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">{category}</span>
                  <span className="text-sm text-[#1E54B7]">{count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#1E54B7] h-2 rounded-full"
                    style={{ width: `${(count / data.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">Progress Tracking</h4>
          <div className="flex items-center justify-center h-40">
            <div className="relative w-40 h-40">
              {/* Pie chart for tracking status */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {Object.entries(trackingStatus).map(([status, count], index) => {
                  const percentage = (count / data.length) * 100
                  const colors = {
                    Achieved: "#4CAF50",
                    "On Track": "#2196F3",
                    Behind: "#FFC107",
                    "Not Started": "#9E9E9E",
                  }
                  const colorKey = status as keyof typeof colors
                  const color = colors[colorKey] || "#1E54B7"

                  // Calculate the slice
                  const startAngle =
                    index === 0
                      ? 0
                      : Object.entries(trackingStatus)
                          .slice(0, index)
                          .reduce((acc, [_, c]) => acc + (c / data.length) * 360, 0)

                  const endAngle = startAngle + percentage * 3.6

                  // Convert to radians
                  const startRad = ((startAngle - 90) * Math.PI) / 180
                  const endRad = ((endAngle - 90) * Math.PI) / 180

                  // Calculate points
                  const x1 = 50 + 40 * Math.cos(startRad)
                  const y1 = 50 + 40 * Math.sin(startRad)
                  const x2 = 50 + 40 * Math.cos(endRad)
                  const y2 = 50 + 40 * Math.sin(endRad)

                  // Create arc flag
                  const largeArcFlag = percentage > 50 ? 1 : 0

                  // Create path
                  const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                  return <path key={status} d={path} fill={color} stroke="#333" strokeWidth="0.5" />
                })}
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(trackingStatus).map(([status, count]) => {
              const colors = {
                Achieved: "#4CAF50",
                "On Track": "#2196F3",
                Behind: "#FFC107",
                "Not Started": "#9E9E9E",
              }
              const colorKey = status as keyof typeof colors
              const color = colors[colorKey] || "#1E54B7"

              return (
                <div key={status} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                  <span className="text-sm text-gray-300">
                    {status} ({count})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
        <h4 className="text-white font-medium mb-3">Individual Priority Areas</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Priority</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Category</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Area</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Target</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Review Date</th>
                <th className="py-2 px-3 text-xs font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const statusColors = {
                  Achieved: "bg-green-500/20 text-green-300",
                  "On Track": "bg-blue-500/20 text-blue-300",
                  Behind: "bg-yellow-500/20 text-yellow-300",
                  "Not Started": "bg-gray-500/20 text-gray-300",
                }
                const colorKey = item.Tracking as keyof typeof statusColors
                const statusColor = statusColors[colorKey] || "bg-gray-500/20 text-gray-300"

                return (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-2 px-3 text-sm text-white">{item.Priority}</td>
                    <td className="py-2 px-3 text-sm text-gray-300">{item.Category}</td>
                    <td className="py-2 px-3 text-sm text-gray-300">{item.Area}</td>
                    <td className="py-2 px-3 text-sm text-gray-300">{item.Target}</td>
                    <td className="py-2 px-3 text-sm text-gray-300">{item["Review Date"]}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>{item.Tracking}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

