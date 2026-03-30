# Deploying to Netlify

This project is configured for easy deployment to Netlify.

## Steps to Deploy:

1.  **Connect to GitHub/GitLab/Bitbucket:**
    *   Push your code to a repository.
    *   Log in to Netlify and click "Add new site" > "Import an existing project".
    *   Select your repository.

2.  **Configure Build Settings:**
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
    *   (These are already configured in `netlify.toml`)

3.  **Environment Variables:**
    *   Go to **Site settings** > **Environment variables**.
    *   Add `GEMINI_API_KEY` with your Google AI Studio API key.

4.  **Deploy:**
    *   Click "Deploy site".

## Configuration Files:

-   `netlify.toml`: Main configuration for Netlify build and redirects.
-   `public/_redirects`: Fallback redirect rule for SPA routing.
