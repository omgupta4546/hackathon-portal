# Deployment Fix Guide

The login error you are experiencing is likely due to two reasons:
1.  **Hardcoded `localhost` URLs**: The frontend code was trying to connect to `localhost` even when deployed. I have fixed this in the code.
2.  **Missing Environment Variables**: Vercel and Render need to know about each other's URLs.

## 1. Code Changes (Already Done)
I have updated the following files to use a dynamic `API_URL`:
- `client/src/utils/api.js`: Now exports `API_URL` and `BASE_URL`.
- `client/src/pages/Login.jsx`: Uses `API_URL` for Google Login.
- `client/src/pages/AdminDashboard.jsx`: Uses `BASE_URL` for file downloads.
- `server/controllers/authController.js`: Uses `CLIENT_URL` for Google Auth redirects (Fixed the redirect loop/error).

## 2. Required Actions (You Must Do This)

### Step A: Push Changes to GitHub
You need to push the code changes I just made to your GitHub repository so Vercel can pick them up.
```bash
git add .
git commit -m "Fix: Replace hardcoded localhost URLs with dynamic API_URL"
git push origin main
```

### Step B: Configure Vercel (Frontend)
1.  Go to your **Vercel Project Settings**.
2.  Navigate to **Environment Variables**.
3.  Add the following variable:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://your-render-backend-url.onrender.com/api` (Replace with your actual Render backend URL)
4.  **Redeploy** your project on Vercel for the changes to take effect.

### Step C: Configure Render (Backend)
1.  Go to your **Render Dashboard**.
2.  Select your backend service.
3.  Navigate to **Environment**.
4.  Add/Update the following variable:
    *   **Key**: `CLIENT_URL`
    *   **Value**: `https://hackathon-portal-psi.vercel.app` (Your Vercel frontend URL)
    *   **Key**: `GOOGLE_CALLBACK_URL` (If you are using Google Auth)
    *   **Value**: `https://your-render-backend-url.onrender.com/api/auth/google/callback`
5.  **Redeploy** (or it might auto-deploy) to ensure the CORS settings are updated.

## Summary
- **Vercel** needs `VITE_API_URL` to know where to send requests.
- **Render** needs `CLIENT_URL` to allow requests from Vercel (CORS).
- **Code** needs to use these variables instead of `localhost` (Fixed).

Once you complete these steps, the login should work!