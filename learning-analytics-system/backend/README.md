# Backend - Learning Analytics System

## Setup
1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Seed the database (optional for demo data):
   ```bash
   python seed_data.py
   ```
4. Run the API:
   ```bash
   python app.py
   ```

## Environment
Create a `.env` file with:
```
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me
DATABASE_URL=sqlite:///backend/data/analytics.db
CORS_ORIGINS=http://localhost:5173
```

## Demo Credentials
- `instructor` / `password`
- `dept_admin` / `password`
- `sys_admin` / `password`
