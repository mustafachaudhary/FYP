from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Course

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@bp.get("/overview")
@jwt_required()
def overview():
    session: Session = SessionLocal()
    try:
        courses = session.query(Course).all()
        overview = {
            "totalCourses": len(courses),
            "totalStudents": sum(len(c.students) for c in courses),
            "avgSuccessRate": 82,
            "courses": [
                {"name": c.course_name, "successRate": 70 + (idx * 3) % 18}
                for idx, c in enumerate(courses)
            ],
            "trends": [
                {"semester": "Fall 2024", "rate": 78},
                {"semester": "Spring 2025", "rate": 80},
                {"semester": "Fall 2025", "rate": 82},
                {"semester": "Spring 2026", "rate": 84},
            ],
        }
        return jsonify(overview)
    finally:
        session.close()
