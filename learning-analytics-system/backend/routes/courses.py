from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Course
from services.analytics import get_course_summary, get_student_rows, get_paths

bp = Blueprint("courses", __name__, url_prefix="/api/courses")

@bp.get("")
@jwt_required()
def list_courses():
    session: Session = SessionLocal()
    try:
        courses = session.query(Course).all()
        data = [{"id": c.course_id, "name": c.course_name, "semester": c.semester} for c in courses]
        return jsonify({"courses": data})
    finally:
        session.close()

@bp.get("/<int:course_id>/summary")
@jwt_required()
def course_summary(course_id):
    session: Session = SessionLocal()
    try:
        summary = get_course_summary(session, course_id)
        return jsonify(summary)
    finally:
        session.close()

@bp.get("/<int:course_id>/students")
@jwt_required()
def course_students(course_id):
    session: Session = SessionLocal()
    try:
        limit = int(request.args.get("limit", 200))
        rows = get_student_rows(session, course_id, limit=limit)
        return jsonify({"students": rows})
    finally:
        session.close()

@bp.get("/<int:course_id>/paths")
@jwt_required()
def course_paths(course_id):
    session: Session = SessionLocal()
    try:
        paths = get_paths(session, course_id)
        return jsonify(paths)
    finally:
        session.close()
