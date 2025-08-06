# Blog App Application

A full-stack blog application built with React frontend and Node.js/Express backend, using MongoDB for data storage.

## Features

- User authentication (signup/login)
- Create, edit, and delete blog posts (authenticated users only)
- Public blog listing with pagination
- Responsive design for desktop and mobile
- Individual blog post viewing

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Database**: MongoDB
- **Deployment**: Azure (ready)

## Getting Started

### Prerequisites

- Node.js (v14 or higher) ✅
- MongoDB (local or MongoDB Atlas) ✅
- npm or yarn ✅

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-deps
   ```

3. Set up environment variables:
   - Copy `backend/env.example` to `backend/.env`
   - Update MongoDB connection string and JWT secret

4. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5001) and frontend development server (port 3000).

### Quick Start (Tested Configuration)

The application has been fully tested and is working correctly:

1. **Backend API** (http://localhost:5001):
   - ✅ User registration and authentication
   - ✅ Blog CRUD operations
   - ✅ MongoDB integration
   - ✅ JWT token-based security

2. **Frontend Application** (http://localhost:3000):
   - ✅ Responsive user interface
   - ✅ User authentication flows
   - ✅ Blog management features
   - ✅ Public blog browsing with pagination

3. **Database**:
   - ✅ MongoDB connection established
   - ✅ User and blog models working
   - ✅ Data persistence verified

## Project Structure

```
omnify/
├── backend/          # Express.js API server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── styles/      # CSS styles
│   └── public/
└── package.json      # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Blogs
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:id` - Get single blog (public)
- `POST /api/blogs` - Create blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (authenticated, author only)
- `DELETE /api/blogs/:id` - Delete blog (authenticated, author only)

## Testing

### Manual Testing Results

The application has been thoroughly tested:

1. **User Registration**: ✅ Successfully creates new users with validation
2. **User Login**: ✅ Authenticates users and provides JWT tokens
3. **Blog Creation**: ✅ Authenticated users can create blog posts
4. **Blog Listing**: ✅ Public access to all published blogs with pagination
5. **Blog Detail**: ✅ Individual blog posts are viewable by everyone
6. **Blog Editing**: ✅ Authors can edit their own blogs
7. **Blog Deletion**: ✅ Authors can delete their own blogs
8. **Responsive Design**: ✅ Works on desktop and mobile devices
9. **Security**: ✅ Proper authentication and authorization

### API Testing

All API endpoints are functional:

```bash
# Health check
curl http://localhost:5001/

# Register user
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all blogs (public)
curl http://localhost:5001/api/blogs
```
