# Learning Analytics Prediction System

This repository implements the system described in the SRS and SDD. It provides a Flask API backend and a React dashboard frontend to analyze student learning paths, detect at-risk students, and generate course insights.

## Project Layout
- `backend/` Flask API, database models, seed script
- `frontend/` React dashboard (Instructor, Department Admin, System Admin)
- `Data/` Raw and processed learning analytics datasets

## Quick Start (Development)
1. Backend
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python seed_data.py
   python app.py
   ```
2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Demo Credentials
- `instructor` / `password`
- `dept_admin` / `password`
- `sys_admin` / `password`

## Data Source
The seed script uses `learning-analytics-system/Data/raw/AllCombined.csv` to populate demo students and predictions.
