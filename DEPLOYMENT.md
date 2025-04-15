# Deployment Guide for CFC Performance Insights

This guide covers how to deploy the CFC Performance Insights application to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your machine
- Node.js and npm installed

## Build and Deployment Process

### Local Testing Before Deployment

1. Make sure all API routes have the required static export configuration:
   ```bash
   node scripts/check-static-exports.js
   ```

2. Run a local build to ensure everything compiles correctly:
   ```bash
   npm run build
   ```

### GitHub Pages Deployment

The repository is set up with GitHub Actions to automatically build and deploy to GitHub Pages when changes are pushed to the main branch.

1. Push your changes to the main branch:
   ```bash
   git push origin main
   ```

2. Wait for the GitHub Actions workflow to complete. You can monitor its progress in the "Actions" tab of the GitHub repository.

3. Once complete, your site will be available at:
   `https://[username].github.io/CFC_Performance_Insights_Vizathon/`

## Static Export Configuration

For Next.js static export to work properly with API routes:

1. All API route files need to have these exports:
   ```typescript
   // Add these exports for static export compatibility
   export const dynamic = 'force-static';
   export const revalidate = false;
   ```

2. API routes should provide mock data for static export:
   ```typescript
   if (process.env.NODE_ENV === 'production') {
     // Return mock data for static export
     return new NextResponse(JSON.stringify(mockData), {
       headers: {
         'Content-Type': 'application/json',
       },
     });
   }
   ```

3. Pages should account for basePath when fetching from API routes:
   ```typescript
   const basePath = process.env.NODE_ENV === 'production' ? '/CFC_Performance_Insights_Vizathon' : '';
   const response = await fetch(`${basePath}/api/data/my-endpoint`);
   ```

## Troubleshooting

If you encounter issues with the deployment:

1. Check that all API routes have the required static export configuration
2. Ensure all pages account for the basePath when making API requests
3. Verify that mock data is provided for all API routes
4. Look at the GitHub Actions logs for specific error messages
5. Test the build locally with `npm run build` to identify issues before deployment

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)