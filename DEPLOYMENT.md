# Deployment Guide

This guide explains how to deploy your MERN stack application for free using **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites
1.  **GitHub Account**: Your code must be pushed to GitHub (you've already done this).
2.  **MongoDB Atlas**: You should have your connection string ready (starts with `mongodb+srv://...`).

---

## Part 1: Deploy Backend (Render)

1.  **Sign Up**: Go to [render.com](https://render.com/) and sign up with GitHub.
2.  **New Web Service**: Click **"New +"** -> **"Web Service"**.
3.  **Connect Repo**: Select your `hackathon-portal` repository.
4.  **Configure Settings**:
    *   **Name**: `hackathon-portal-api` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
    *   **Branch**: `master`
    *   **Root Directory**: `server` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Plan**: Free
5.  **Environment Variables**: Scroll down to "Environment Variables" and add:
    *   `MONGO_URI`: Your MongoDB connection string (from your local `.env`).
    *   `JWT_SECRET`: Any secret random string (e.g., `mysecretkey123`).
    *   `PORT`: `10000` (Render sets this automatically, but good to add).
    *   `CLIENT_URL`: Leave this blank for now (we'll add the frontend URL later).
    *   `SMTP_HOST`: `smtp.gmail.com`
    *   `SMTP_PORT`: `587`
    *   `SMTP_USER`: Your email (from your local `.env`).
    *   `SMTP_PASS`: Your App Password (from your local `.env`).
    *   `GOOGLE_CLIENT_ID`: Your Google Client ID (from your local `.env`).
    *   `GOOGLE_CLIENT_SECRET`: Your Google Client Secret (from your local `.env`).
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
6.  **Deploy**: Click **"Create Web Service"**.
7.  **Copy URL**: Once deployed, copy the URL (e.g., `https://hackathon-portal-api.onrender.com`). This is your **Backend URL**.

> **⚠️ Important Note on File Uploads**: On the free tier of Render, files uploaded to the server (like resumes) will disappear if the server restarts. For a production app, you should use a service like AWS S3 or Cloudinary.

---

## Part 2: Deploy Frontend (Vercel)

1.  **Sign Up**: Go to [vercel.com](https://vercel.com/) and sign up with GitHub.
2.  **Add New Project**: Click **"Add New..."** -> **"Project"**.
3.  **Import Repo**: Import `hackathon-portal`.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should be detected automatically).
    *   **Root Directory**: Click "Edit" and select `client`.
5.  **Environment Variables**: Expand the section and add:
    *   **Key**: `VITE_API_URL`
    *   **Value**: Your **Backend URL** from Part 1 + `/api` (e.g., `https://hackathon-portal-api.onrender.com/api`).
6.  **Deploy**: Click **"Deploy"**.
7.  **Copy URL**: Once finished, you will get a domain (e.g., `https://hackathon-portal.vercel.app`). This is your **Frontend URL**.

---

## Part 3: Connect Them

1.  Go back to your **Render Dashboard** (Backend).
2.  Go to **Environment Variables**.
3.  Add/Update `CLIENT_URL` with your **Frontend URL** (e.g., `https://hackathon-portal.vercel.app`).
    *   *Note: Do not add a trailing slash `/`.*
4.  **Save Changes**: This might trigger a redeploy of the backend.

## Done! 🚀
Your website is now live. Users can visit your Vercel URL to access the portal.
