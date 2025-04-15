/**
 * Helper function to handle basePath for GitHub Pages deployment
 * This ensures API routes and assets work correctly in both development and production
 */

export function getBasePath() {
  return process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
}

/**
 * Get the correct URL for API calls, accounting for the basePath
 * @param endpoint - The API endpoint path (should start with /)
 * @returns Full URL with basePath if needed
 */
export function getApiUrl(endpoint: string) {
  const basePath = getBasePath();
  return `${basePath}${endpoint}`;
}

/**
 * Get the correct URL for assets, accounting for the basePath
 * @param path - The asset path (should start with /)
 * @returns Full URL with basePath if needed
 */
export function getAssetUrl(path: string) {
  const basePath = getBasePath();
  return `${basePath}${path}`;
}