# Debugging Your Deployment

Since "Sign Up" and "Login" are both failing, the issue is likely one of two things:
1.  **The Backend cannot connect to the Database** (MongoDB IP Whitelist).
2.  **The Frontend cannot connect to the Backend** (CORS or URL issues).

Please follow these steps to find and fix the error.

## Step 1: Check MongoDB IP Whitelist (Most Likely Cause)
MongoDB Atlas blocks all connections by default. You must allow your Render server to connect.

1.  Go to **MongoDB Atlas** (cloud.mongodb.com).
2.  Click **Network Access** in the left sidebar.
3.  Click **+ ADD IP ADDRESS**.
4.  Select **Allow Access From Anywhere** (or enter `0.0.0.0/0`).
5.  Click **Confirm**.
    *   *Why?* Render changes IP addresses frequently, so you need to allow all IPs.

## Step 2: Check Browser Console for Errors
This will tell us if it's a CORS issue or a Server Error.

1.  Open your website: `https://hackathon-portal-psi.vercel.app/`
2.  Right-click anywhere and select **Inspect**.
3.  Go to the **Console** tab.
4.  Try to **Login** or **Sign Up**.
5.  **Look for red errors:**
    *   **"CORS error"** or **"Network Error"**:
        *   *Fix:* Check `CLIENT_URL` in Render. It must be `https://hackathon-portal-psi.vercel.app` (no trailing slash).
    *   **"500 Internal Server Error"**:
        *   *Fix:* This is a backend crash. Check Render Logs (Step 3).
    *   **"404 Not Found"**:
        *   *Fix:* Your `VITE_API_URL` in Vercel might be wrong. It should end with `/api`.

## Step 3: Check Render Logs
If the browser says "500" or "Network Error", the backend logs will tell you why.

1.  Go to **Render Dashboard**.
2.  Click on your **Web Service**.
3.  Click **Logs**.
4.  Scroll down to the bottom.
5.  **Look for:**
    *   `MongoNetworkError`: You didn't do Step 1 (IP Whitelist).
    *   `MongooseServerSelectionError`: Wrong `MONGO_URI` or Step 1.
    *   `client_id`: Google OAuth error.

## Step 4: Verify Environment Variables
Double-check these exact values:

**On Render (Backend):**
- `MONGO_URI`: `mongodb+srv://...` (Your full connection string)
- `CLIENT_URL`: `https://hackathon-portal-psi.vercel.app`
- `JWT_SECRET`: `some-secret-key`

**On Vercel (Frontend):**
- `VITE_API_URL`: `https://your-render-app-name.onrender.com/api`
    *   *Make sure it has `/api` at the end!*

---
**Try Step 1 first.** It is the most common reason for "everything failing" after deployment.
