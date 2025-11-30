# Robotics Club Hackathon Portal

A comprehensive web portal for managing the internal hackathon of the Robotics Club. This platform facilitates team registration, problem statement selection, submission management, and admin oversight.

## Features

### 🚀 Landing Page
-   **Dynamic Animations**: Floating rocket animation (exclusive to the home page).
-   **Responsive Design**: Optimized for both laptop and mobile devices.
-   **Feature Showcase**: Highlights key aspects of the hackathon.

### 👥 Participant Portal
-   **Team Formation**: Users can create teams of up to 4 members.
-   **Problem Selection**: Browse and select problem statements from Hardware, Software, or Both categories.
-   **Dashboard**: View team status, selected problem, and submission details.
-   **Submission**: Submit project links (GitHub) and files.

### 🛡️ Admin Dashboard
-   **Overview**: View all teams, submissions, and problems.
-   **Problem Management**: Create, edit, and delete problem statements.
    -   Categories: Hardware, Software, Both.
-   **Submission Tracking**: Shortlist or reject submissions.
-   **Round Management**: Manage hackathon rounds and timelines.

## Tech Stack

-   **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Authentication**: JWT, Google OAuth (Passport.js)
-   **Email**: Nodemailer (Gmail SMTP)

## Getting Started

### Prerequisites
-   Node.js installed
-   MongoDB URI
-   Google OAuth Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd hackathon-portal
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    -   Create a `.env` file in the `server` directory with the following:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_uri
        JWT_SECRET=your_jwt_secret
        CLIENT_URL=http://localhost:5173
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        SMTP_HOST=smtp.gmail.com
        SMTP_PORT=587
        SMTP_USER=your_email@gmail.com
        SMTP_PASS=your_app_password
        ```

4.  **Run the Application**
    ```bash
    # Run server (from server directory)
    npm run dev

    # Run client (from client directory)
    npm run dev
    ```

## Admin Access
To promote a user to admin, run the following command in the `server` directory:
```bash
node makeAdmin.js user@example.com
```

## License
This project is licensed under the MIT License.
