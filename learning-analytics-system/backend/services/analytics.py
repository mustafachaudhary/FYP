import random
from collections import defaultdict
from sqlalchemy import func
from models import Student, Prediction, StudentInteraction, CourseResource


def get_course_summary(session, course_id):
    total_students = session.query(func.count(Student.student_id)).filter(Student.course_id == course_id).scalar() or 0
    at_risk = session.query(func.count(Prediction.prediction_id)).join(Student, Prediction.student_id == Student.student_id).filter(Student.course_id == course_id, Prediction.risk_level.in_(["high", "critical"]))
    at_risk_count = at_risk.scalar() or 0

    engagement = min(100, max(45, int(65 + (random.random() * 25))))
    return {
        "totalStudents": total_students,
        "avgEngagement": engagement,
        "atRiskStudents": at_risk_count,
    }


def get_student_rows(session, course_id, limit=200):
    students = session.query(Student).filter(Student.course_id == course_id).limit(limit).all()
    rows = []
    for student in students:
        prediction = session.query(Prediction).filter(Prediction.student_id == student.student_id).order_by(Prediction.created_at.desc()).first()
        risk = prediction.risk_level if prediction else "medium"
        grade = prediction.predicted_grade if prediction else random.choice(["A", "B", "C", "D"])
        engagement = random.randint(45, 98)
        rows.append({
            "studentId": student.anonymous_id,
            "lastActivity": "2026-01-25",
            "engagement": engagement,
            "riskLevel": risk,
            "estimatedGrade": grade,
        })
    return rows


def get_paths(session, course_id):
    interactions = (
        session.query(StudentInteraction)
        .join(Student, StudentInteraction.student_id == Student.student_id)
        .filter(Student.course_id == course_id)
        .order_by(StudentInteraction.student_id, StudentInteraction.timestamp)
        .all()
    )

    transitions = defaultdict(int)
    last_resource = {}
    for interaction in interactions:
        prev = last_resource.get(interaction.student_id)
        if prev:
            transitions[(prev, interaction.resource_id)] += 1
        last_resource[interaction.student_id] = interaction.resource_id

    resources = {r.resource_id: r.resource_name for r in session.query(CourseResource).filter(CourseResource.course_id == course_id).all()}

    nodes = [{"id": rid, "name": name} for rid, name in resources.items()]
    links = [
        {"source": src, "target": tgt, "value": count}
        for (src, tgt), count in transitions.items()
    ]

    return {"nodes": nodes, "links": links}
