# Run Steps: Learning Analytics Prediction System

## Project layout

```text
FYP/
├── PROJECT_RUN_STEPS.md
└── learning-analytics-system/
    ├── backend/                  # Flask API, models, seed script
    ├── frontend/                 # React dashboard
    └── Data/                     # Raw and processed learning data
```

## One-time setup

Run the setup script from the project root:

```bash
cd /home/mustafa/Downloads/FYP/learning-analytics-system
./setup.sh
```

## Start the backend

```bash
cd /home/mustafa/Downloads/FYP/learning-analytics-system/backend
source .venv/bin/activate
python app.py
```

The backend starts on:

```text
http://127.0.0.1:5000
```

## Start the frontend

Open another terminal:

```bash
cd /home/mustafa/Downloads/FYP/learning-analytics-system/frontend
npm run dev
```

Open the dashboard at:

```text
http://127.0.0.1:5173
```

## Demo credentials

```text
instructor / password
dept_admin / password
sys_admin / password
```

## Stop the project

Press `Ctrl+C` in each terminal.
