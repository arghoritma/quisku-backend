# QuisKU Backend API Documentation

## Overview

QuisKU is an educational quiz application backend built with Node.js, Express, PostgreSQL, and Firebase Authentication. It provides API endpoints for quiz generation, user management, scoring, and leaderboards.

## Tech Stack

- Node.js & Express
- PostgreSQL with Knex.js
- Firebase Authentication
- Google Gemini AI
- Express Validator
- JWT Authentication

## Prerequisites

- Node.js v14+
- PostgreSQL
- Firebase Admin SDK credentials
- Google Gemini AI API key

## Installation

# Clone repository

git clone [repository-url]

# Install dependencies

npm install

# Set up environment variables

cp .env.example .env

# Start development server

npm run dev

# Start production server

npm start

## Database Schema

### Tables

1. **users**

   - Primary user information
   - Tracks scores and XP

2. **quizzes**

   - Quiz content and metadata
   - Supports multiple grades and subjects

3. **user_quiz_scores**

   - Records user performance
   - Tracks completion time

4. **leaderboard**
   - Global and category-specific rankings
   - Updated based on user performance

## API Endpoints

### Authentication Routes (`/auth`)

- `POST /auth/signup` - Register new user
  - Required fields: username, email, password, full_name

### User Routes (`/users`)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Quiz Routes (`/quizz`)

- `POST /quizz/generate` - Generate new quiz
- `GET /quizz/:quizId` - Get quiz by ID
- `GET /quizz` - Get filtered quizzes
- `GET /quizz/user/quizzes` - Get user's quizzes

### Score Routes (`/scores`)

- `POST /scores` - Save quiz score
- `GET /scores/user/:user_id` - Get user scores
- `GET /scores/leaderboard` - Get global leaderboard
- `GET /scores/leaderboard/:category` - Get category leaderboard
- `GET /scores/stats/:user_id` - Get user statistics

### Leaderboard Routes (`/leaderboard`)

- `GET /leaderboard` - Get global leaderboard
- `GET /leaderboard/subject/:subject` - Get subject leaderboard
- `GET /leaderboard/grade/:grade` - Get grade leaderboard

### System Routes

- `GET /status` - Check API status
- `GET /test-firebase` - Test Firebase connection
- `GET /test-database` - Test database connection
- `GET /test-gemini` - Test Gemini AI connection
- `GET /test-auth` - Test authentication

## Authentication

The API uses Firebase Authentication. All protected routes require a valid Firebase ID token in the Authorization header:

Authorization: Bearer [firebase-id-token]

## Data Models

### User Model

{
user_id: string,
username: string,
email: string,
password: string,
full_name: string,
phone: string,
profile_picture: string,
total_score: number,
total_xp: number,
created_at: timestamp,
updated_at: timestamp
}

### Quiz Model

{
quiz_id: UUID,
grade: enum,
subject: enum,
questions: JSONB,
created_at: timestamp,
created_by: UUID
}

### Score Model

{
score_id: UUID,
user_id: UUID,
quiz_id: UUID,
score: number,
xp_earned: number,
completed_at: timestamp
}

### Leaderboard Model

{
leaderboard_id: UUID,
user_id: UUID,
total_score: number,
total_xp: number,
rank: number,
updated_at: timestamp
}

## Workflow

1. User registration/login
2. Access dashboard with valid token
3. Generate/take quizzes
4. Submit answers and receive scores
5. Update leaderboard rankings
6. View statistics and progress

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

# Run in development mode

npm run dev

# Run in production mode

npm start

## Environment Variables

PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=quisku
FIREBASE_ADMIN_SDK=path/to/credentials.json
GEMINI_API_KEY=your_api_key
