import csv
import os
import random
from datetime import datetime, timedelta

from db import init_db, SessionLocal
from models import Course, Student, CourseResource, StudentInteraction, User, Prediction, Alert
from utils.security import hash_password

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_ROOT, "Data", "raw", "AllCombined.csv")

RESOURCE_TEMPLATES = [
    ("Intro Video", "video"),
    ("Reading 1", "reading"),
    ("Quiz 1", "quiz"),
    ("Lecture 2", "video"),
    ("Assignment 1", "assignment"),
    ("Forum Discussion", "forum"),
    ("Reading 2", "reading"),
    ("Quiz 2", "quiz"),
]


def seed_users(session):
    users = [
        User(username="instructor", password_hash=hash_password("password"), role="instructor"),
        User(username="dept_admin", password_hash=hash_password("password"), role="dept_admin"),
        User(username="sys_admin", password_hash=hash_password("password"), role="admin"),
    ]
    session.add_all(users)


def seed_course(session):
    course = Course(course_name="Learning Analytics", semester="Spring 2026")
    session.add(course)
    session.flush()
    resources = []
    for idx, (name, rtype) in enumerate(RESOURCE_TEMPLATES, start=1):
        resources.append(CourseResource(course_id=course.course_id, resource_name=name, resource_type=rtype, sequence_order=idx))
    session.add_all(resources)
    session.flush()
    return course, resources


def seed_students(session, course_id, resources):
    if not os.path.exists(DATA_PATH):
        print("Dataset not found, seeding mock data")
        data_rows = [
            {"User": f"anon_{i:03d}", "Final_grade": random.uniform(60, 95)}
            for i in range(1, 61)
        ]
    else:
        with open(DATA_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            data_rows = list(reader)[:80]

    students = []
    for idx, row in enumerate(data_rows, start=1):
        anon = row.get("User") or f"anon_{idx:03d}"
        student = Student(anonymous_id=anon, course_id=course_id, enrollment_date=datetime.utcnow() - timedelta(days=random.randint(30, 120)))
        session.add(student)
        session.flush()
        students.append(student)

        # predictions
        grade_value = float(row.get("Final_grade") or random.uniform(60, 95))
        if grade_value >= 85:
            predicted = "A"
            risk = "low"
        elif grade_value >= 75:
            predicted = "B"
            risk = "medium"
        elif grade_value >= 65:
            predicted = "C"
            risk = "high"
        else:
            predicted = "D"
            risk = "critical"

        prediction = Prediction(student_id=student.student_id, week_number=6, predicted_grade=predicted, risk_level=risk)
        session.add(prediction)

        # interactions
        for _ in range(random.randint(8, 20)):
            resource = random.choice(resources)
            interaction = StudentInteraction(
                student_id=student.student_id,
                resource_id=resource.resource_id,
                timestamp=datetime.utcnow() - timedelta(days=random.randint(1, 60)),
                duration_minutes=random.uniform(2, 28),
                interaction_type=random.choice(["view", "download", "submit"]),
            )
            session.add(interaction)

        if risk in ("high", "critical"):
            alert = Alert(student_id=student.student_id, instructor_id=1, severity=risk, status="open")
            session.add(alert)


def main():
    init_db()
    session = SessionLocal()
    try:
        if session.query(User).count() > 0:
            print("Database already seeded.")
            return
        seed_users(session)
        course, resources = seed_course(session)
        seed_students(session, course.course_id, resources)
        session.commit()
        print("Seeded data successfully.")
    finally:
        session.close()

if __name__ == "__main__":
    main()
