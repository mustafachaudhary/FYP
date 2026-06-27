from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from sqlalchemy.orm import Session
from db import SessionLocal
from models import User
from utils.security import verify_password

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.post("/login")
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    session: Session = SessionLocal()
    try:
        user = session.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.password_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(identity={"user_id": user.user_id, "role": user.role})
        return jsonify({"access_token": token, "role": user.role})
    finally:
        session.close()
