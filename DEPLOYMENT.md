# Vercel Deployment Guide - Recipe Explorer

## 🚀 Deployment Instructions

### Prerequisites
1. Vercel account (free tier available at https://vercel.com)
2. MongoDB Atlas account (free tier available at https://mongodb.com/atlas)
3. HuggingFace API key (free at https://huggingface.co/settings/tokens)

---

## Backend Deployment (Python/FastAPI)

### Step 1: Deploy Backend to Vercel

1. **Open Terminal** in the `backend` folder:
   ```bash
   cd backend
   ```

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy Backend**:
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
   
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/recipe_explorer
   DATABASE_NAME=recipe_explorer
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

6. **Copy Backend URL**: 
   - After deployment, copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## Frontend Deployment (React/Vite)

### Step 2: Update Frontend Configuration

1. **Update `.env.production`** file:
   ```bash
   cd ../frontend
   ```

2. **Edit `.env.production`** and add your backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

### Step 3: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   vercel --prod
   ```

2. Vercel automatically detects Vite and builds your frontend

---

## MongoDB Setup

### Step 4: Configure MongoDB Atlas

1. **Create MongoDB Atlas Cluster**:
   - Go to https://mongodb.com/atlas
   - Create a free cluster
   - Create a database user with password

2. **Whitelist IP Addresses**:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for Vercel serverless functions

3. **Get Connection String**:
   - Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Populate Database** (optional):
   - Run locally first to populate data:
   ```bash
   cd backend
   python populate_data.py
   ```

---

## Verification

### Test Your Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```

2. **Frontend Access**:
   - Open `https://your-frontend-url.vercel.app` in browser
   - Test recipe search and AI features

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: CORS is properly configured in the backend. Add your Frontend URL to allow_origins if needed.

### Issue 2: MongoDB Connection Timeout
**Solution**: 
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string in environment variables
- Ensure database user has correct permissions

### Issue 3: Environment Variables Not Working
**Solution**: 
- Redeploy after adding environment variables in Vercel Dashboard
- Check variable names match exactly
- Use `@variable_name` syntax in vercel.json for secrets

### Issue 4: Build Failures
**Backend**: Check `requirements-vercel.txt` has all dependencies
**Frontend**: Run `npm run build` locally to test

---

## Project Structure

```
Recipe Explorer/
├── backend/              # FastAPI backend
│   ├── api/
│   │   └── index.py     # Vercel serverless entry point
│   ├── vercel.json      # Backend Vercel config
│   └── requirements-vercel.txt
│
└── frontend/            # React/Vite frontend
    ├── vercel.json      # Frontend Vercel config
    └── .env.production  # Production environment vars
```

---

## Deployment Commands Summary

```bash
# Backend Deployment
cd backend
vercel --prod

# Frontend Deployment  
cd frontend
vercel --prod
```

---

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URL=mongodb+srv://...
DATABASE_NAME=recipe_explorer
HUGGINGFACE_API_KEY=hf_...
```

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

---

## Support & Resources

- Vercel Documentation: https://vercel.com/docs
- FastAPI Deployment: https://vercel.com/docs/functions/serverless-functions/runtimes/python
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- HuggingFace API: https://huggingface.co/docs/api-inference

---

## Notes

- ✅ Both Backend and Frontend will be deployed as separate Vercel projects
- ✅ Both can be deployed on the free tier
- ✅ Manage environment variables from the Vercel Dashboard
- ✅ Every deployment comes with automatic HTTPS

---

