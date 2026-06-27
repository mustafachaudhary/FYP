# Build Summary

## What Was Built
- Flask backend with JWT authentication, SQLAlchemy schema, and analytics endpoints.
- React frontend implementing the three dashboards in the SDD wireframes.
- Seed script that imports the Moodle dataset from `learning-analytics-system/Data/raw/AllCombined.csv` to generate demo analytics.

## Key Endpoints
- `POST /api/auth/login`
- `GET /api/courses`
- `GET /api/courses/<id>/summary`
- `GET /api/courses/<id>/students`
- `GET /api/courses/<id>/paths`
- `GET /api/admin/overview`
- `GET /api/system/health`
- `GET /api/system/jobs`
- `GET /api/system/logs`

## Notes
- Database defaults to SQLite for development but can be swapped to MySQL via `DATABASE_URL`.
- Frontend uses demo login to simplify the evaluation flow.
