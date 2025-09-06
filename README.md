Abbey Fullstack Task- Frontend
A React frontend application for a social media platform with user authentication, profiles, following system, and posts functionality.


Features

User Authentication: Login and registration with JWT token management
Automatic Token Refresh: Seamless token renewal on expiration
User Profiles: View and manage user profiles
Social Features: Follow/unfollow users and view posts
Responsive Design: Works on desktop and mobile devices
Error Handling: handling of API errors and network issues

Tech Stack

React with TypeScript
Axios for API communication
JWT token management with automatic refresh
Local Storage for token persistence
Modern React patterns with hooks and functional components

Prerequisites

Node.js (v16 or higher)
npm or yarn
Backend API running (see backend repository)

Quick Start
1. Clone the Repository
git clone https://github.com/UgwuObed/abbey-frontend
cd abbey-frontend


2. Install Dependencies
npm install


3. Environment Setup
Create a .env file in the root directory:
# Backend API URL
REACT_APP_API_URL=http://localhost:3001/api


4. Start the Application
# Development mode with hot reload
npm start

# Build for production
npm run build

The application will be available at: http://localhost:3000
Backend Dependency
This frontend requires the backend API to be running. Make sure you have:

Backend server running on http://localhost:3001
Database connected and migrated
CORS configured to allow http://localhost:3000

Quick backend verification:

Backend health: http://localhost:3001/health
API status: http://localhost:3001/api

Demo Features
Authentication Flow

Register: Create new account 
Login: JWT token authentication
Auto-refresh: Seamless token renewal
Profile: View/edit user information

Features

User Profiles: Bio, avatar, follower counts
Follow System: Follow/unfollow other users
Posts: Create and view user content
Feed: See posts from followed users

Browser Demo Guide

Register a new account at /register
Login with credentials at /login
View Profile - see your account info
Follow Users - search and follow others
Create Posts - share content
View Feed - see followed users' posts

Application Scripts
npm start       # Development server
npm run build   # Production build
npm test        # Run tests
