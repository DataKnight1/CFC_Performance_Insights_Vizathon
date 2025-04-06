export function convertToCSV(data: any[]) {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(","))

  // Add rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header] || ""
      // Escape quotes and wrap in quotes if contains comma
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

export function downloadCSV(data: any[], filename: string) {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printToPDF() {
  // Add a small delay to ensure the print dialog shows after any state updates
  setTimeout(() => {
    window.print()
  }, 100)
}

