/**
 * Check that all API routes have the required static export configuration
 * This script scans all route.ts files in the app/api directory
 * and checks if they have the required exports for static export
 */

const fs = require('fs');
const path = require('path');

// Find all API route files
function findApiRoutes(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findApiRoutes(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.js') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check if a route has the required static export configuration
function checkStaticExportConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasDynamicExport = content.includes('export const dynamic = \'force-static\'');
  const hasRevalidateExport = content.includes('export const revalidate = false');
  
  return {
    path: filePath,
    hasDynamicExport,
    hasRevalidateExport,
    isValid: hasDynamicExport && hasRevalidateExport
  };
}

// Main function
function main() {
  const apiDir = path.join(__dirname, '..', 'app', 'api');
  
  if (!fs.existsSync(apiDir)) {
    console.error(`API directory not found: ${apiDir}`);
    process.exit(1);
  }
  
  console.log('Checking API routes for static export configuration...');
  console.log('-----------------------------------------------------');
  
  const apiRoutes = findApiRoutes(apiDir);
  const results = apiRoutes.map(checkStaticExportConfig);
  
  const validRoutes = results.filter(r => r.isValid);
  const invalidRoutes = results.filter(r => !r.isValid);
  
  console.log(`Found ${apiRoutes.length} API routes`);
  console.log(`${validRoutes.length} routes have the correct configuration`);
  
  if (invalidRoutes.length > 0) {
    console.error('\nThe following routes are missing required exports:');
    
    invalidRoutes.forEach(route => {
      console.error(`\n${route.path.replace(__dirname + '/../', '')}`);
      
      if (!route.hasDynamicExport) {
        console.error('  - Missing: export const dynamic = \'force-static\'');
      }
      
      if (!route.hasRevalidateExport) {
        console.error('  - Missing: export const revalidate = false');
      }
    });
    
    console.error('\nAdd the following to each invalid route:');
    console.error('// Add these exports for static export compatibility');
    console.error('export const dynamic = \'force-static\';');
    console.error('export const revalidate = false;');
    
    process.exit(1);
  } else {
    console.log('\nAll API routes have the correct static export configuration!');
  }
}

main();