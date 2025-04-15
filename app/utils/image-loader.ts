/**
 * Custom loader for Next.js Image component to handle basePath in GitHub Pages
 */

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function imageLoader({ src, width, quality }: ImageLoaderParams) {
  // If the image is an external URL (e.g., https://...), return it as is
  if (src.startsWith('http')) {
    return src;
  }

  // For local images, add the basePath
  const basePath = process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
  
  // Add width and quality parameters if needed
  const params = new URLSearchParams();
  if (width) {
    params.append('w', width.toString());
  }
  if (quality) {
    params.append('q', quality.toString());
  }

  const paramsString = params.toString() ? `?${params.toString()}` : '';
  return `${basePath}${src}${paramsString}`;
}

/**
 * Get the correct URL for images, accounting for the basePath
 * @param path - The image path (should start with /)
 * @returns Full URL with basePath if needed
 */
export function getImageUrl(path: string) {
  // If it's already an absolute URL, return it unchanged
  if (path.startsWith('http')) {
    return path;
  }
  
  // Otherwise, add the basePath for GitHub Pages in production
  const basePath = process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
  return `${basePath}${path}`;
}