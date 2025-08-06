# Local Testing Guide

## Prerequisites

1. **Node.js** (v14 or higher) - Already installed
2. **MongoDB** - You have several options:

### Option A: MongoDB Atlas (Cloud - Recommended for testing)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get the connection string
5. Update `backend/.env` with your MongoDB Atlas connection string

### Option B: Local MongoDB
```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

### Option C: Docker MongoDB
```bash
# Run MongoDB in Docker
docker run --name mongodb -d -p 27017:27017 mongo:7.0
```

## Setup Steps

1. **Install all dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Configure environment:**
   - Copy `backend/env.example` to `backend/.env`
   - Update the MongoDB connection string in `backend/.env`

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend server on http://localhost:3000

## Testing the Application

1. **Open your browser** and go to http://localhost:3000
2. **Sign up** for a new account
3. **Login** with your credentials
4. **Create a blog post**
5. **View all blogs** (public)
6. **Edit/Delete your blogs**

## API Endpoints Testing

You can also test the API directly:

```bash
# Test server health
curl http://localhost:5000/

# Register a user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get blogs (public)
curl http://localhost:5000/api/blogs
```

## Production Testing with Docker

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend: http://localhost:5000

## Troubleshooting

- **Port conflicts**: Make sure ports 3000, 5000, and 27017 are not in use
- **MongoDB connection**: Check your connection string and MongoDB service status
- **CORS issues**: The frontend proxy is configured to forward API requests to the backend
- **Environment variables**: Ensure all required variables are set in `backend/.env`