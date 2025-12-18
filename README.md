# Assignment Two - Full Stack Movie Application

Name: Yong Hsiang Hsieh
Student Number: 20100776

## Project Overview

This project is a full-stack movie application built with React (frontend) and Express/Node.js (backend), using MongoDB for data persistence. The application allows users to browse movies from TMDB, manage personal lists (favorites, must-watch), and write reviews.

**Key Technologies:**
- Frontend: React, Material-UI, React Query, React Router
- Backend: Express.js, MongoDB (Mongoose), JWT Authentication
- External API: TMDB (The Movie Database)

---

## 1. Setup & Initial Migration

### 1.1 Project Setup

The codebase was set up by combining:
- The TMDB API lab work (backend foundation)
- Assignment One codebase (React frontend)

Initially, the frontend and backend were separate and not connected. The frontend was calling TMDB directly.

### 1.2 API Migration (Frontend → Backend)

**The Problem:** The frontend had 17 TMDB API functions calling the external API directly. This exposed the API key and didn't utilize the backend.

**The Solution:** I migrated all 17 API functions to the backend, making the backend act as a proxy to TMDB.

**Before Migration:**
```
Frontend → TMDB API (directly)
```

**After Migration:**
```
Frontend → Backend → TMDB API
```

### 1.3 Modular Architecture

**Frontend API Structure:**
- `backend-client.js` - Centralized HTTP client with `backendFetch()` function
- All API calls go through this single file
- Handles errors consistently across all requests

**Backend API Structure:**
- `tmdb-api.js` - Centralized TMDB fetching with helper functions
- `movies/index.js` - Express router for movie endpoints
- `people/index.js` - Express router for people/actor endpoints

**Key Decision:** I kept the code DRY (Don't Repeat Yourself) by creating reusable helper functions:

```javascript
// Backend: Reusable TMDB fetch helper
const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', process.env.TMDB_KEY);
  // ... standardized fetching
};
```

```javascript
// Frontend: Reusable backend fetch helper
export const backendFetch = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  // ... standardized error handling
};
```

---

## 2. Authentication Implementation

### 2.1 Backend Authentication

The backend uses JWT (JSON Web Tokens) for authentication.

**Registration Flow:**
1. User submits username and password
2. Backend validates username (3-20 chars, alphanumeric + underscore)
3. Backend validates password (8+ chars, letter + digit + special char)
4. Password is hashed using bcrypt (10 salt rounds)
5. User is saved to MongoDB

**Login Flow:**
1. User submits credentials
2. Backend finds user by username
3. Backend compares password hash using bcrypt
4. If valid, JWT token is generated and returned

**Key Decision - Token Format:**
The backend returns the raw JWT token without the "Bearer " prefix:

```javascript
// Backend returns:
{ success: true, token: "eyJhbGciOiJIUzI1NiIs..." }

// NOT:
{ success: true, token: "Bearer eyJhbGciOiJIUzI1NiIs..." }
```

**Reasoning:** This is more standard. The frontend adds the "Bearer " prefix when making authenticated requests. This separates concerns - the backend generates tokens, the frontend handles HTTP header formatting.

### 2.2 Authentication Middleware

The `authenticate` middleware protects routes:

```javascript
const authenticate = async (request, response, next) => {
  // 1. Extract Authorization header
  // 2. Split to get token (remove "Bearer ")
  // 3. Verify token with jwt.verify()
  // 4. Find user in database
  // 5. Attach user to req.user
  // 6. Call next() to proceed
};
```

**Understanding `next()`:** 
- `next()` tells Express to proceed to the next middleware/route handler
- Without calling `next()`, the request hangs forever
- `next(error)` skips to the error handler

### 2.3 Frontend Authentication

**AuthContext** manages global authentication state:
- `token` - JWT token
- `user` - User object (username)
- `isAuthenticated` - Boolean flag
- `login()` / `logout()` / `signup()` - Auth functions

**Key Feature - Password Strength Indicator:**
I added a real-time password strength indicator on the signup page that follows the same validation rules as the backend:

```javascript
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Za-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*#?&]/.test(password)) strength++;
  return strength; // 0-4 scale
};
```

This provides immediate visual feedback before form submission.

### 2.4 Security Improvements

**Removed insecure endpoint:** I removed the `GET /api/users` endpoint that was returning all users. This was from the labs for testing purposes but exposed user data.

**Added token expiration:** JWT tokens expire after 7 days:
```javascript
jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '7d' });
```

---

## 3. User Data Persistence

### 3.1 Database Schema

The User model stores:
```javascript
{
  username: String,
  password: String (hashed),
  favorites: [Number],      // Array of movie IDs
  mustWatch: [Number],      // Array of movie IDs
  reviews: [{               // Array of review objects
    movieId: Number,
    movieTitle: String,
    author: String,
    rating: Number (1-5),
    content: String,
    createdAt: Date
  }]
}
```

### 3.2 API Endpoints

**Favorites:**
- `GET /api/users/favorites` - Get user's favorites (returns IDs)
- `POST /api/users/favorites/:movieId` - Add to favorites
- `DELETE /api/users/favorites/:movieId` - Remove from favorites

**Must-Watch:**
- `GET /api/users/mustwatch` - Get user's must-watch list (returns IDs)
- `POST /api/users/mustwatch/:movieId` - Add to must-watch
- `DELETE /api/users/mustwatch/:movieId` - Remove from must-watch

**Reviews:**
- `GET /api/users/reviews` - Get user's reviews (returns complete objects)
- `POST /api/users/reviews` - Add a review (JSON body)

### 3.3 Key Design Decision: IDs vs Complete Objects

**For Favorites/MustWatch - Store IDs Only:**
```javascript
// GET /api/users/favorites returns:
{ success: true, favorites: [550, 438631, 157336] }
```

**Reasoning:**
- Movies are external data from TMDB
- Movie info changes (ratings, posters update)
- I want fresh data, not stale cached data
- Frontend fetches full details using the IDs

**For Reviews - Store Complete Objects:**
```javascript
// GET /api/users/reviews returns:
{ success: true, reviews: [
  { movieId: 550, movieTitle: "Fight Club", rating: 5, content: "...", ... }
]}
```

**Reasoning:**
- Reviews are user-generated content - I own this data
- A review is a snapshot in time
- No need to fetch external data
- Faster display, no additional API calls

### 3.4 Frontend Context Integration

**MoviesContext** manages:
- `favorites` - Array of movie IDs
- `mustWatch` - Array of movie IDs  
- `myReviews` - Array of review objects

**Optimistic Updates:**
When adding/removing items, I update the UI immediately and sync to backend in background:

```javascript
const addToFavorites = async (movie) => {
  // 1. Update local state immediately (optimistic)
  setFavorites((prev) => [...prev, movie.id]);
  
  // 2. Sync to backend in background
  if (isAuthenticated && token) {
    await addFavorite(token, movie.id);
  }
};
```

**Auth State Watcher:**
I use `useEffect` to automatically load/clear lists based on auth state:

```javascript
useEffect(() => {
  if (isAuthenticated && token) {
    loadUserLists(token);  // Load on login
  } else if (!isAuthenticated && wasAuthenticated) {
    clearLists();  // Clear on logout
  }
}, [isAuthenticated, token]);
```

---

## 4. Protected Routes

### 4.1 Implementation

The `ProtectedRoute` component guards routes that require authentication:

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isRestoringSession } = useContext(AuthContext);

  if (isRestoringSession) return null;  // Wait for session check
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};
```

**Protected Pages:**
- `/movies/my-list` - User's favorites, must-watch, and reviews
- `/reviews/form` - Review submission form

### 4.2 Issue: Flash to Login on Refresh

**The Problem:** When refreshing a protected page while logged in, users briefly saw the login page before being shown their content.

**Root Cause:** 
1. Page refreshes → React re-renders
2. `ProtectedRoute` checks `isAuthenticated` → false (not loaded yet)
3. Redirects to login page
4. `localStorage` token is read → too late!

**The Solution:** Added `isRestoringSession` state:

```javascript
const [isRestoringSession, setIsRestoringSession] = useState(true);

useEffect(() => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    // Restore session...
  }
  setIsRestoringSession(false);  // Mark complete
}, []);
```

`ProtectedRoute` waits for session restoration before making redirect decisions.

---

## 5. Additional Features

### 5.1 Festive Theme (Christmas 2025)

I added seasonal features for fun:
- **Snowfall Animation** - CSS-only snowflakes falling across the screen
- **Festive Banner** - "Merry Christmas & Happy 2026" with shimmer effect
- **Dark Winter Background** - Navy gradient for atmosphere

### 5.2 Dark Theme Adjustments

With the dark background, I needed to update component visibility:
- Filter card: Added solid white background with blur effect
- Page headers: White background for contrast
- Section headings: White text color
- Empty state messages: Semi-transparent white

---

## 6. Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Flash to login on refresh | ProtectedRoute checked auth before localStorage was read | Added `isRestoringSession` state to delay redirect |
| Token format inconsistency | Backend returned "Bearer " prefix | Changed backend to return raw token; frontend adds prefix |
| Reviews not saving | Form field name mismatch (`review` vs `content`) | Mapped form field to correct name in onSubmit |
| User list exposed | `GET /api/users` returned all users | Removed the endpoint entirely |
| Dark theme visibility | Components had transparent backgrounds | Added solid backgrounds with backdrop blur |

---

## 7. Key Learnings

### 7.1 Architecture Patterns

- **Proxy Pattern**: Backend acts as proxy to external APIs, hiding API keys
- **Middleware Chain**: Express middleware pattern with `next()` for authentication
- **Context API**: React Context for global state without prop drilling
- **Optimistic Updates**: Update UI immediately, sync backend in background

### 7.2 Error Handling - Separation of Concerns

**Key Decision:** The backend owns all error messages; the frontend just displays them.

```javascript
// Backend returns error messages
res.status(400).json({ 
  success: false, 
  msg: 'Username must be 3-20 characters long...' 
});

// Frontend simply displays whatever backend returns
if (!data.success) {
  throw new Error(data.msg);  // Use backend's message directly
}
```

**Why this matters:**
- Backend handles all validation logic and business rules
- Frontend doesn't need to know validation rules
- Error messages are consistent (single source of truth)
- Changing an error message only requires backend update
- Clear separation: backend = logic, frontend = display

### 7.3 Context Hierarchy - Parent/Child Relationship

**Architecture:**
```
<AuthContextProvider>        ← Parent (authentication)
  <MoviesContextProvider>    ← Child (user data)
    <App />
  </MoviesContextProvider>
</AuthContextProvider>
```

**The Constraint:**
- MoviesContext CAN use AuthContext (child can access parent)
- AuthContext CANNOT use MoviesContext (parent cannot access child)

**The Solution - Observer Pattern with useEffect:**

Since AuthContext cannot call MoviesContext directly, I use `useEffect` in MoviesContext to "listen" for auth state changes:

```javascript
// In MoviesContext
useEffect(() => {
  if (isAuthenticated && token) {
    loadUserLists(token);   // Auth changed → load data
  } else if (!isAuthenticated && wasAuthenticated) {
    clearLists();           // Logged out → clear data
  }
}, [isAuthenticated, token]);
```

**Benefits:**
- AuthContext only handles authentication (single responsibility)
- MoviesContext only handles user data (single responsibility)
- They communicate through state changes, not direct calls
- Loose coupling - neither depends directly on the other's implementation

### 7.4 Enterprise Architecture Principles Applied

This project applies principles I learned from the **Enterprise System Architecture** module:

**1. Loose Coupling**
- AuthContext and MoviesContext are loosely coupled
- They communicate through React's state system, not direct function calls
- If MoviesContext has a bug, AuthContext still works perfectly
- Changes to one don't require changes to the other

**2. High Cohesion**
- Each context has a single, focused responsibility
- AuthContext: authentication only (login, logout, token management)
- MoviesContext: user movie data only (favorites, must-watch, reviews)
- All related functionality is grouped together

**3. Single Responsibility Principle**
- AuthContext does ONE thing: manage authentication state
- MoviesContext does ONE thing: manage user movie collections
- Backend validation does ONE thing: validate and return appropriate errors
- Frontend display does ONE thing: render what it receives

**Why this matters in practice:**
- Easier to debug (know exactly where to look)
- Easier to test (test each piece independently)
- Easier to modify (changes are isolated)
- More maintainable codebase

### 7.5 Authentication Flow

Understanding JWT authentication end-to-end:
1. Frontend sends token in `Authorization: Bearer <token>` header
2. Backend extracts and verifies token signature
3. Backend finds user and attaches to `req.user`
4. Route handler accesses user data

### 7.6 Data Storage Decisions

- **External data (movies)**: Store IDs only, fetch fresh details on demand
- **User data (reviews)**: Store complete objects, no external dependencies

### 7.7 Security Considerations

- Never expose API keys to frontend
- Hash passwords with bcrypt
- Use JWT expiration
- Remove debugging endpoints before production
- Validate input on both frontend and backend

---

## 8. Project Structure

```
web-api-ca/
├── movies-api/                 # Backend
│   ├── api/
│   │   ├── movies/            # Movie routes
│   │   ├── people/            # Actor routes
│   │   ├── users/             # Auth & user data routes
│   │   └── tmdb-api.js        # TMDB helper functions
│   ├── authenticate/          # JWT middleware
│   ├── db/                    # MongoDB connection
│   └── index.js               # Express app entry
│
├── react-movies/              # Frontend
│   └── src/
│       ├── api/               # Backend client
│       ├── components/        # Reusable UI components
│       ├── contexts/          # React Context (Auth, Movies)
│       ├── hooks/             # Custom React hooks
│       ├── pages/             # Page components
│       └── main.jsx           # App entry with routing
│
└── README.md                  # This file
```

---

## 9. Running the Project

### Backend
```bash
cd movies-api
npm install
npm run dev
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd react-movies
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Environment Variables

**Backend (.env):**
```
MONGO_DB=mongodb+srv://...
TMDB_KEY=your_tmdb_api_key
SECRET=your_jwt_secret
```
