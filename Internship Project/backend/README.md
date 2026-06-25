# PaperPlane Corporate Gifting Backend

This is the backend API for the PaperPlane Corporate Gift Proposal Generator. It is built using Python 3.12, Flask, and SQLAlchemy.

## 📋 Prerequisites
- **Python 3.12+** installed on your system.
- **MySQL Server** installed (Alternatively, you can use SQLite for quick local testing by modifying the `.env` file).

---

## 🚀 Setup Instructions for Teammates

Follow these exact steps to get the backend running on your local machine:

### 1. Create a Virtual Environment
It is highly recommended to run this project inside a virtual environment to prevent dependency conflicts. Open your terminal inside the `backend` folder and run:
```bash
python -m venv venv
```

Activate the environment:
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

### 2. Install Dependencies
All required Python packages (Flask, SQLAlchemy, ReportLab for PDFs, Marshmallow, etc.) are locked in `requirements.txt`. Run:
```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables
Ensure you have a `.env` file in the root of the `backend` folder. If you don't have one, create it and add:
```env
FLASK_ENV=development
# Change 'password' to your actual MySQL root password
DATABASE_URL=mysql+pymysql://root:password@localhost/paperplane_db
SECRET_KEY=super-secret-key-change-in-production
OPENAI_API_KEY=your-placeholder-key
```
*(Note: If you don't want to install MySQL, you can change the `DATABASE_URL` to `sqlite:///paperplane.db` to use a local file database instead).*

### 4. Initialize and Seed the Database
Before running the server, you must create the database tables and insert the sample gift packages so the AI rule engine has products to choose from. Run these commands in order:
```bash
python create_db.py
python seed_db.py
```

### 5. Start the Server
Start the Flask development server:
```bash
python run.py
```
The server will now be listening on `http://localhost:5000`.

---

## 📚 API Documentation (For the Frontend Team)

I have exported all of the API routes into a single file for you! 
Look for the `paperplane_api_collection.json` file in this folder.

**How to use it:**
1. Open **Postman** (or the Thunder Client VS Code extension).
2. Click **Import**.
3. Select `paperplane_api_collection.json`.

This will instantly load all 7 API endpoints, pre-filled with the exact URLs, required JSON body structures, and Headers. 

**Note on CORS:** 
CORS has already been globally enabled on the backend. Your frontend `fetch()` or `axios` calls from `localhost:3000` (or similar) will not be blocked by the browser.

---

## 🌍 Production Deployment Guide

If you are planning to deploy this backend yourself to a live server (e.g., Render, Heroku, AWS, or a VPS), follow these guidelines:

### 1. Update Frontend Configuration
In your React frontend code (`src/utils/api.js`), ensure that the `baseURL` points to your live deployed server's URL instead of `localhost:5000`. It is best practice to use an environment variable (e.g. `import.meta.env.VITE_API_URL`).

### 2. Configure Database for Production
SQLite (`paperplane.db`) is fine for local testing, but it writes to the local file system. Most cloud providers (like Heroku or Render) have **ephemeral file systems** that wipe local files on every restart, meaning you will lose your data!
* **Solution:** Create a managed PostgreSQL or MySQL database (e.g., on Supabase, AWS RDS, or Render) and set the `DATABASE_URL` in your production `.env` to point to it. SQLAlchemy will automatically connect and recreate your tables.

### 3. Use a Production WSGI Server
Do **NOT** use `python run.py` in production (this starts Flask's built-in development server).
We have included `waitress` in the `requirements.txt` specifically for serving the app robustly on Windows, and you can also use `gunicorn` on Linux.

To run the app in production using Waitress (cross-platform):
```bash
waitress-serve --host=0.0.0.0 --port=5000 run:app
```

### 4. Secure Your Secrets
Ensure that `SECRET_KEY` and `JWT_SECRET_KEY` in your `.env` file (or your hosting provider's Secret Manager) are set to long, random, cryptographically secure strings. Do NOT use the default fallback values in production.
