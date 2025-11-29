# Robotics x DSC Internal Hackathon Portal

A full-stack MERN application for managing internal hackathons.

## Features

- **User Roles**: Participants (Team Leaders/Members) and Admins.
- **Team Management**: Create teams, invite members via code, join teams.
- **Problem Statements**: View and select problem statements (Hardware/Software).
- **Submissions**: File upload (PDF/PPTX) and GitHub link submission for rounds.
- **Admin Dashboard**: View all teams, manage submissions (shortlist/reject), upload scores.
- **Responsive UI**: Built with React + Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router v6
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local disk storage (Multer) - *Ready for S3 migration*

## Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

## Quick Start (Local Development)

1.  **Clone the repository**

2.  **Setup Backend**

    ```bash
    cd server
    npm install
    
    # Create .env file
    cp .env.example .env
    # Edit .env if needed (default connects to local mongo)

    # Seed Database (Creates Admin User & Problem Statements)
    npm run seed

    # Start Server
    npm run dev
    ```

    *Server runs on http://localhost:5000*

    **Default Admin Credentials:**
    - Email: `admin@hack.local`
    - Password: `AdminPass123`

3.  **Setup Frontend**

    ```bash
    cd client
    npm install
    npm run dev
    ```

    *Client runs on http://localhost:5173*

## Deployment

### Backend (Render/Railway)

1.  Push `server` folder to a git repo.
2.  Set environment variables in the dashboard:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A strong secret key.
    - `NODE_ENV`: `production`
3.  Build Command: `npm install`
4.  Start Command: `npm start`

### Frontend (Vercel)

1.  Push `client` folder to a git repo.
2.  Import project in Vercel.
3.  Build Command: `npm run build`
4.  Output Directory: `dist`
5.  **Important**: Update `src/utils/api.js` base URL to your deployed backend URL if not using a proxy.

## API Documentation

Import the provided Postman collection to test API endpoints.

### Key Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/teams` - Create Team
- `GET /api/problems` - Get Problem Statements
- `POST /api/submissions` - Submit Project

## License

MIT
