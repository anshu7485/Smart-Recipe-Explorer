# Smart Recipe Explorer with AI Assistance

**Assignment Submission:** Python Backend / Full-Stack Intern (0-1 Years Experience)  
**Framework:** FastAPI (Python)  
**Database:** MongoDB Atlas (Cloud)  
**AI Service:** Google Gemini API (Free Tier)  
**Frontend:** React + TypeScript + Tailwind CSS

---

## 📋 Project Overview

A fully responsive Recipe Management Application that demonstrates practical understanding of:
- ✅ Python backend development with clean coding practices
- ✅ REST API design and architecture
- ✅ GenAI integration using free services (Google Gemini)
- ✅ Logical problem-solving and full-stack development
- ✅ Proper error handling and documentation
- ✅ Responsive design for all devices (mobile, tablet, desktop)

### Key Features Implemented

**1. Recipe Management (CRUD Operations)**
- Create new recipes with complete information
- Read/retrieve recipes with filtering
- Update existing recipes
- Delete recipes
- MongoDB database for data persistence

**2. Advanced Search & Filtering**
- ✅ Filter by **Cuisine** (Indian, Italian, Chinese, etc.)
- ✅ Filter by **Vegetarian/Non-Vegetarian**
- ✅ Filter by **Preparation Time** (in minutes)
- ✅ Filter by **Tags** (dinner, party, quick, etc.)
- ✅ Filter by **Ingredient Match** (search recipes containing specific ingredients)
- ✅ Combine multiple filters simultaneously
- ✅ Fully responsive search interface for mobile devices

**3. GenAI Integration (Both Options Implemented)**
- ✅ **Recipe Suggestion:** Input available ingredients → AI suggests complete recipe with steps
- ✅ **Recipe Simplification:** Convert complex recipes into beginner-friendly instructions
- Uses **Google Gemini API** (completely free, 60 requests/minute)
- Intelligent fallback system when AI is unavailable
- Async processing for optimal performance
- ✅ ChatGPT-style AI interface with professional design

**4. Frontend Integration (Optional - Completed)**
- React + TypeScript for type safety
- Beautiful, responsive UI with Tailwind CSS
- ✅ **Fully responsive design** - works perfectly on mobile, tablet, and desktop
- ✅ **ChatGPT-inspired AI Assistant page** - professional chat interface
- ✅ Mobile-friendly navigation with hamburger menu
- Recipe browsing with real-time filters
- AI Assistant interface with floating chat widget
- Complete recipe creation form
- ✅ Responsive cards, modals, and forms

---

## 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│            Frontend (React + TypeScript)                 │
│                                                          │
│  • Recipe listing with search/filter UI                 │
│  • AI Assistant page                                     │
│  • Recipe creation form                                  │
│  • Detailed recipe view modal                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ REST API (HTTP/JSON)
                   │
┌──────────────────▼──────────────────────────────────────┐
│         Python Backend API (FastAPI)                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Routes Layer:                                     │ │
│  │  • recipe_routes.py - CRUD endpoints               │ │
│  │  • ai_routes.py - GenAI endpoints                  │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
│  ┌────────────────▼───────────────────────────────────┐ │
│  │  Services Layer:                                   │ │
│  │  • recipe_service.py - Business logic              │ │
│  │  • ai_service.py - AI integration                  │ │
│  └────────────┬───────────────────┬───────────────────┘ │
│               │                   │                      │
└───────────────┼───────────────────┼─────────────────────┘
                │                   │
                ▼                   ▼
        ┌───────────────┐   ┌──────────────────┐
        │   MongoDB     │   │  Google Gemini   │
        │   Database    │   │  API (gemini-    │
        │   (Cloud)     │   │  2.5-flash)      │
        └───────────────┘   └──────────────────┘
```

---

## 📁 Project Structure

```
Recipe Explorer/
│
├── backend/                      # Python FastAPI Backend
│   ├── main.py                   # Application entry point with lifespan
│   ├── config.py                 # Configuration & environment variables
│   ├── database.py               # MongoDB connection management
│   ├── models.py                 # Pydantic data models
│   │
│   ├── routes/                   # API route handlers
│   │   ├── __init__.py
│   │   ├── recipe_routes.py      # Recipe CRUD endpoints
│   │   └── ai_routes.py          # AI feature endpoints
│   │
│   ├── services/                 # Business logic layer
│   │   ├── __init__.py
│   │   ├── recipe_service.py     # Recipe operations
│   │   └── ai_service.py         # Google Gemini integration
│   │
│   ├── tests/                    # Unit and API tests
│   │   ├── __init__.py
│   │   └── test_recipe_api.py    # Recipe API tests
│   │
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Environment template
│   ├── .gitignore                # Git ignore file
│   ├── requirements.txt          # Python dependencies
│   └── populate_data.py          # Optional: Sample data for testing
│
└── frontend/                     # React Frontend (Optional)
    ├── src/
    │   ├── components/           # Reusable React components
    │   ├── pages/                # Page components
    │   ├── services/             # API service layer
    │   ├── types/                # TypeScript type definitions
    │   └── App.tsx               # Main app component
    ├── package.json              # Node dependencies
    └── vite.config.ts            # Vite configuration
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Python 3.8+** installed
- **MongoDB** (local installation OR free MongoDB Atlas account)
- **Node.js 18+** (for frontend - optional)
- **Google Gemini API Key** (free - instructions below)

### Step 1: Get Free Google Gemini API Key

1. Visit: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Edit .env file and add your credentials:
# MONGODB_URL=your_mongodb_connection_string
# GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Configure Environment Variables

Edit `backend/.env`:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/recipe_explorer
DATABASE_NAME=recipe_explorer

# Google Gemini API Configuration (Free)
GEMINI_API_KEY=your_api_key_here

# Application Settings
API_HOST=0.0.0.0
API_PORT=8000
```

### Step 4: Start Backend Server

```bash
cd backend

# Start with uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will run at:** http://localhost:8000

### Step 5: Frontend Setup (Optional)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at:** http://localhost:5173

---

## 📚 API Documentation

### Access Interactive API Docs

Once the backend is running, access:
- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc

### API Endpoints Summary

#### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/recipes/` | Create a new recipe |
| `GET` | `/api/recipes/` | Get all recipes |
| `GET` | `/api/recipes/{id}` | Get recipe by ID |
| `PUT` | `/api/recipes/{id}` | Update recipe |
| `DELETE` | `/api/recipes/{id}` | Delete recipe |
| `POST` | `/api/recipes/search` | Search recipes with filters |
| `GET` | `/api/recipes/count` | Get total recipe count |

#### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/suggest-recipe` | Get AI recipe suggestion from ingredients |
| `POST` | `/api/ai/simplify-recipe` | Simplify recipe instructions |
| `GET` | `/api/ai/health` | Check AI service status |

#### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root health check |
| `GET` | `/api/health` | Detailed health check |

---

## 🧪 Sample API Requests

### 1. Create Recipe

```bash
curl -X POST "http://localhost:8000/api/recipes/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paneer Butter Masala",
    "cuisine": "Indian",
    "is_vegetarian": true,
    "prep_time_minutes": 40,
    "ingredients": ["paneer", "tomato", "cream", "butter", "spices"],
    "difficulty": "medium",
    "instructions": "Step 1: Heat butter. Step 2: Add tomatoes. Step 3: Add paneer and cream.",
    "tags": ["dinner", "party", "rich"]
  }'
```

### 2. Search Recipes with Filters

```bash
curl -X POST "http://localhost:8000/api/recipes/search" \
  -H "Content-Type: application/json" \
  -d '{
    "cuisine": "Indian",
    "is_vegetarian": true,
    "max_prep_time": 45
  }'
```

### 3. AI Recipe Suggestion

```bash
curl -X POST "http://localhost:8000/api/ai/suggest-recipe" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["paneer", "tomato", "onion"]
  }'
```

### 4. AI Recipe Simplification

```bash
curl -X POST "http://localhost:8000/api/ai/simplify-recipe" \
  -H "Content-Type: application/json" \
  -d '{
    "recipe_id": "your_recipe_id_here"
  }'
```

---

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework with auto-documentation
- **Python 3.8+** - Programming language
- **Motor** - Async MongoDB driver for Python
- **Pydantic** - Data validation using Python type annotations
- **MongoDB** - NoSQL database for flexible recipe storage
- **Google Gemini API** - Free AI service for intelligent features
- **pytest** - Testing framework

### Frontend (Optional Enhancement)
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **Vite** - Next-generation frontend tooling

---

## 🎯 Assignment Requirements Compliance

### Mandatory Requirements ✅

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **Python Backend** | FastAPI framework | ✅ |
| **REST APIs** | Complete CRUD operations | ✅ |
| **Database** | MongoDB (cloud-based) | ✅ |
| **Search - Cuisine** | Filter by cuisine type | ✅ |
| **Search - Vegetarian** | Filter by dietary preference | ✅ |
| **Search - Prep Time** | Filter by preparation time | ✅ |
| **Search - Tags** | Filter by tags | ✅ |
| **Search - Ingredients** | Match by ingredients | ✅ |
| **GenAI Endpoint** | Dedicated AI routes | ✅ |
| **Recipe Suggestion** | AI suggests recipes from ingredients | ✅ |
| **Recipe Simplification** | AI simplifies instructions | ✅ |
| **Free AI Service** | Google Gemini (free tier) | ✅ |
| **No Hardcoded Keys** | Environment variables (.env) | ✅ |
| **Error Handling** | 400/404/500 HTTP codes | ✅ |
| **Clean Code** | Meaningful names, comments | ✅ |
| **Testing** | pytest test cases | ✅ |
| **API Documentation** | Auto-generated Swagger docs | ✅ |

### Optional Enhancements ✅

| Enhancement | Implementation | Status |
|-------------|----------------|--------|
| **Frontend** | React + TypeScript | ✅ |
| **UI Design** | Tailwind CSS responsive design | ✅ |
| **Type Safety** | TypeScript + Pydantic | ✅ |
| **Async Operations** | Async/await throughout | ✅ |

---

## 💡 Design Decisions & Thought Process

### 1. Why FastAPI?
- ✅ High performance with async support
- ✅ Automatic interactive API documentation (Swagger/ReDoc)
- ✅ Built-in data validation with Pydantic
- ✅ Modern Python type hints
- ✅ Easy to test and maintain

### 2. Why MongoDB?
- ✅ Flexible schema for varying recipe structures
- ✅ Easy to extend recipe model with new fields
- ✅ Cloud-based (MongoDB Atlas) for easy deployment
- ✅ Excellent Python support with Motor (async driver)

### 3. Why Google Gemini API?
- ✅ Completely FREE with generous limits (60 req/min)
- ✅ Latest AI model (gemini-2.5-flash)
- ✅ Better quality responses than deprecated HuggingFace
- ✅ Simple integration with Python SDK
- ✅ No credit card required

### 4. Architecture Decisions
- **Separation of Concerns:** Routes → Services → Database
- **Error Handling:** Comprehensive try-catch with proper HTTP codes
- **Environment Variables:** Secure configuration management
- **Async Operations:** Non-blocking I/O for better performance
- **Type Safety:** Pydantic models ensure data integrity
- **Fallback System:** AI features work even without API key

### 5. Why Optional Frontend?
- ✅ Demonstrates full-stack capability
- ✅ Better evaluation of API design
- ✅ Shows understanding of modern web development
- ✅ Provides complete user experience

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_recipe_api.py -v
```

### Test Coverage

- ✅ Recipe CRUD operations
- ✅ Search and filter functionality
- ✅ Error handling scenarios
- ✅ Data validation

---

## 📊 Sample Data

The application starts with an **empty database**. Recipes are added through:
1. **Frontend UI** (recommended)
2. **API endpoints** (via Swagger docs or curl)
3. **Optional script:** Run `python populate_data.py` to add 5 sample recipes for testing

### Sample Recipes (if using populate_data.py):
- Paneer Butter Masala (Indian, Vegetarian, 40 min)
- Chicken Biryani (Indian, Non-Vegetarian, 90 min)
- Aloo Gobi (Indian, Vegetarian, 30 min)
- Pasta Aglio e Olio (Italian, Vegetarian, 20 min)
- Vegetable Fried Rice (Chinese, Vegetarian, 25 min)

---

## 🐛 Error Handling

The application implements proper HTTP status codes:

| Status Code | Usage |
|-------------|-------|
| `200 OK` | Successful GET, PUT operations |
| `201 Created` | Successful POST (recipe created) |
| `400 Bad Request` | Invalid input data |
| `404 Not Found` | Recipe not found |
| `500 Internal Server Error` | Server errors |

---

## 🔐 Environment Configuration

### Required Environment Variables

```env
# MongoDB
MONGODB_URL=<your_mongodb_connection_string>
DATABASE_NAME=recipe_explorer

# AI Service
GEMINI_API_KEY=<your_gemini_api_key>

# Server
API_HOST=0.0.0.0
API_PORT=8000
```

### Getting MongoDB Connection String

**Option 1: MongoDB Atlas (Cloud - Free)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string

**Option 2: Local MongoDB**
```env
MONGODB_URL=mongodb://localhost:27017
```

---

## 🚀 Deployment

### Backend Deployment Options
- **Railway** (recommended for FastAPI)
- **Render** (free tier available)
- **Heroku** (with gunicorn)
- **DigitalOcean** App Platform

### Frontend Deployment Options
- **Vercel** (recommended for React)
- **Netlify**
- **GitHub Pages**

---

## 📝 Additional Notes

### Assumptions Made:
1. Users have basic understanding of Python and REST APIs
2. MongoDB connection string is properly configured
3. Google Gemini API key is obtained (free, no payment required)
4. Frontend is optional but demonstrates full-stack capability

### Future Enhancements:
- User authentication and authorization
- Recipe rating and reviews
- Image upload for recipes
- Meal planning features
- Nutritional information calculation
- Social sharing capabilities

---

## 👨‍💻 Development Workflow

1. **Backend First:** Core API development with FastAPI
2. **Database Integration:** MongoDB connection and models
3. **AI Integration:** Google Gemini API integration
4. **Testing:** Unit tests and API testing
5. **Frontend:** React UI development
6. **Documentation:** Comprehensive README and API docs

---

## 📞 Support & Contact

### How to Use This Project

1. **Backend Only:** Follow backend setup steps, use Swagger UI for testing
2. **Full Stack:** Setup both backend and frontend, access via browser
3. **API Testing:** Use Swagger docs at http://localhost:8000/api/docs

### Troubleshooting

**Issue:** "Module not found"
- **Solution:** Ensure virtual environment is activated and dependencies are installed

**Issue:** "MongoDB connection failed"
- **Solution:** Check MONGODB_URL in .env file

**Issue:** "AI service unavailable"
- **Solution:** Verify GEMINI_API_KEY in .env file

---

## ✅ Submission Checklist

- ✅ Python backend with FastAPI
- ✅ Complete CRUD operations
- ✅ All 5 search filters implemented
- ✅ Google Gemini AI integration
- ✅ Recipe suggestion feature
- ✅ Recipe simplification feature
- ✅ Free AI service with env variables
- ✅ Proper error handling
- ✅ Clean code structure
- ✅ Test cases included
- ✅ API documentation (Swagger)
- ✅ Comprehensive README
- ✅ Optional frontend (bonus)
- ✅ GitHub repository

- ✅ **Vercel deployment ready**

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

This project is fully configured for Vercel deployment.

**Quick Deploy:**
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your repository
4. Add environment variables:
   - `MONGODB_URL`
   - `GEMINI_API_KEY`
   - `DATABASE_NAME`
5. Deploy!

**Detailed Instructions:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Live Demo:**
- **Frontend:** https://frontend-beryl-tau-10.vercel.app/
- **Backend API:** https://backend-three-coral-17.vercel.app/

---

**Assignment Completed By:** [Your Name]  
**Date:** December 21, 2025  
**Framework:** FastAPI + React  
**AI Service:** Google Gemini (Free)  
**Database:** MongoDB Atlas  
**Deployment:** Vercel Ready ✅

**Thank you for reviewing this project!** 

---

## 📄 License

This project is created for assignment evaluation purposes only and is not intended for commercial use.
