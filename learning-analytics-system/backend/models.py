from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True)
    course_name = Column(String(255), nullable=False)
    semester = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    students = relationship("Student", back_populates="course")
    resources = relationship("CourseResource", back_populates="course")

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True)
    anonymous_id = Column(String(255), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="students")
    interactions = relationship("StudentInteraction", back_populates="student")

class CourseResource(Base):
    __tablename__ = "course_resources"

    resource_id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    resource_name = Column(String(255), nullable=False)
    resource_type = Column(String(50), nullable=False)
    sequence_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="resources")

class StudentInteraction(Base):
    __tablename__ = "student_interactions"

    interaction_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("course_resources.resource_id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Float, default=0.0)
    interaction_type = Column(String(50), default="view")

    student = relationship("Student", back_populates="interactions")

class LearningPattern(Base):
    __tablename__ = "learning_patterns"

    pattern_id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    pattern_sequence = Column(String(1024), nullable=False)
    avg_grade = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"

    prediction_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    predicted_grade = Column(String(50), nullable=False)
    risk_level = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    instructor_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    severity = Column(String(50), nullable=False)
    status = Column(String(50), default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

