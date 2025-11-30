# Google OAuth Production Setup

You are absolutely right! You need to add your **Deployed URLs** to Google Cloud Console, otherwise "Sign in with Google" will fail.

## 1. Authorized JavaScript Origins
Add your **Vercel Frontend URL**:
```
https://hackathon-portal-psi.vercel.app
```
*(Do not add a slash `/` at the end)*

## 2. Authorized Redirect URIs
Add your **Render Backend URL** with the callback path:
```
https://hackathon-portal-api.onrender.com/api/auth/google/callback
```

## 3. Save
Click **Save**. It may take a few minutes to update.

---
**Summary:**
- **Localhost** settings allow you to test on your computer.
- **Production** settings allow the deployed app to work.
You can keep both!
