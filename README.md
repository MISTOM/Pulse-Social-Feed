# Social Media Feed Application

A full-stack social media feed application built with React, Node.js, GraphQL, and PostgreSQL.

## Project Structure

This is a monorepo project with the following structure:

- `packages/frontend`: React/TypeScript frontend built with Vite and styled with Tailwind CSS
- `packages/backend`: Node.js/Express backend with GraphQL API and Prisma ORM
- `packages/shared`: Shared code between frontend and backend

## Features

- User authentication (register, login, logout)
- Create, view, and like posts
- User profiles with follow/unfollow functionality
- Feed of posts

## Getting Started

### Prerequisites

- Node.js v14+
- PostgreSQL
- Git

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd goymarey-tech-assesment
   ```

2. Install dependencies
   ```
   cd packages/backend && npm install
   cd ../frontend && npm install
   ```

3. Configure environment variables
   ```
   # In packages/backend/.env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/social_media_feed?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=4000
   ```

4. Set up the database
   ```
   cd packages/backend
   npx prisma migrate dev
   ```

5. Start the backend server
   ```
   cd packages/backend
   npm run dev
   ```

6. Start the frontend development server
   ```
   cd packages/frontend
   npm run dev
   ```

7. Open your browser to `http://localhost:5173`

## Development Process

1. Backend:
   - Set up Express server with Apollo GraphQL
   - Created Prisma schema with User, Post, Like, and Follow models
   - Implemented authentication with JWT
   - Built resolvers for users, posts, likes, and follows

2. Frontend:
   - Set up Vite/React/TypeScript project
   - Implemented Apollo Client for GraphQL
   - Built components for posts, user profiles, and feed
   - Styled with Tailwind CSS
   - Added authentication state management

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Apollo Client
  - Tailwind CSS
  - React Router

- **Backend**:
  - Node.js
  - Express
  - Apollo Server
  - GraphQL
  - Prisma ORM
  - PostgreSQL
  - JWT Authentication