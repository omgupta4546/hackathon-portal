# Fix Email Sending Timeout

The error `ETIMEDOUT` happens because Render (and many clouds) block or throttle the standard email port (587).
I have updated the code to support the **SSL Port (465)**, which is usually allowed.

## 1. Update Render Environment Variables
You need to change the email port in your Render Dashboard.

1.  Go to **Render Dashboard**.
2.  Select your **Web Service**.
3.  Go to **Environment**.
4.  Find `SMTP_PORT` and change it from `587` to **`465`**.
5.  Ensure `SMTP_HOST` is `smtp.gmail.com`.
6.  **Save Changes**.

## 2. Redeploy
Render might auto-deploy the code changes I just pushed.
- If it does, just wait for it to finish.
- If not, click **Manual Deploy** -> **Deploy latest commit**.

## 3. Test
Once deployed and the variable is updated:
1.  Try to **Sign Up** again.
2.  The email should now send successfully!

---
---

## 4. STILL NOT WORKING? Check your Password!
If you are using your **regular Gmail password**, it will **FAIL**.
You MUST use a **Google App Password**.

### How to get an App Password:
1.  Go to your **Google Account Settings** -> **Security**.
2.  Enable **2-Step Verification** (if not already on).
3.  Search for **"App Passwords"** in the search bar at the top.
4.  Create a new app password (name it "Render").
5.  Copy the 16-character code (e.g., `abcd efgh ijkl mnop`).
6.  Go to **Render Dashboard** -> **Environment**.
7.  Update `SMTP_PASS` with this code (spaces don't matter, my code handles them).
8.  **Save Changes**.

**This is the #1 reason for email failures.**
