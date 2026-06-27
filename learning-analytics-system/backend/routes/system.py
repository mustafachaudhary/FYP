from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

bp = Blueprint("system", __name__, url_prefix="/api/system")

@bp.get("/health")
@jwt_required()
def health():
    return jsonify({
        "api": "UP",
        "database": "UP",
        "cache": "UP",
    })

@bp.get("/jobs")
@jwt_required()
def jobs():
    return jsonify({
        "jobs": [
            {"name": "pattern_mining[course_1]", "status": "Completed", "progress": 100},
            {"name": "model_training[course_2]", "status": "Running", "progress": 65},
            {"name": "risk_scan[course_1]", "status": "Queued", "progress": 0},
        ]
    })

@bp.get("/logs")
@jwt_required()
def logs():
    return jsonify({
        "logs": [
            "2026-01-26 02:15:32 - Data ingestion completed (125,432 records)",
            "2026-01-25 03:22:10 - Model retraining completed (Accuracy: 78.5%)",
            "2026-01-25 05:01:45 - At-risk alerts generated (23 alerts)",
            "2026-01-24 14:33:22 - User 'john_doe' logged in",
        ]
    })
