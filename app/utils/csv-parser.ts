"use client";

export async function fetchCSV(url: string) {
  try {
    console.log('CSV Parser: Fetching from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      console.log('Detected JSON response instead of CSV');
      const jsonData = await response.json();
      console.log('Received JSON data:', jsonData.length, 'records');
      return jsonData;
    }
    
    // Otherwise parse as CSV
    const text = await response.text();
    console.log('CSV text received, length:', text.length);
    console.log('First 100 characters:', text.substring(0, 100));
    
    const parsedData = parseCSV(text);
    console.log('Parsed CSV data, records:', parsedData.length);
    
    return parsedData;
  } catch (error) {
    console.error("Error fetching CSV:", error);
    return [];
  }
}

export function parseCSV(csvText: string) {
  if (!csvText || typeof csvText !== 'string') {
    console.error("Invalid CSV text provided")
    return []
  }
  
  try {
    // Split by both \r\n (Windows) and \n (Unix) line breaks
    const lines = csvText.split(/\r?\n/)
    
    if (lines.length === 0) {
      return []
    }
    
    // Handle quoted values properly
    const parseCSVLine = (line: string): string[] => {
      const values: string[] = []
      let currentValue = ""
      let insideQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          // Toggle quote state
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          // End of field
          values.push(currentValue.trim())
          currentValue = ""
        } else {
          // Regular character
          currentValue += char
        }
      }
      
      // Push the last value
      values.push(currentValue.trim())
      
      return values
    }
    
    // Get headers from the first line
    const headers = parseCSVLine(lines[0])
    
    const results = []
    
    // Parse each data line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = parseCSVLine(line)
      const entry: Record<string, string | number> = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ""
        
        // Try to convert number strings to actual numbers
        const numValue = Number(value)
        entry[header] = !isNaN(numValue) && value !== "" ? numValue : value
      })
      
      results.push(entry)
    }
    
    return results
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return []
  }
}

// Helper function to get a subset of the data
export function filterCSVData(data: any[], filters: Record<string, any>) {
  return data.filter(item => {
    for (const [key, value] of Object.entries(filters)) {
      if (item[key] !== value) {
        return false
      }
    }
    return true
  })
}

// Helper to get unique values for a given field
export function getUniqueValues(data: any[], field: string): any[] {
  const uniqueValues = new Set<any>()
  
  data.forEach(item => {
    if (item[field] !== undefined && item[field] !== null) {
      uniqueValues.add(item[field])
    }
  })
  
  return Array.from(uniqueValues).sort()
}

