from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from flask_cors import cross_origin
import os

LoginSignup_bp = Blueprint('login_signup', __name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://devdynamos-bookstore.netlify.app")

@cross_origin(origin=FRONTEND_URL, methods=["POST", "OPTIONS"], headers=["Content-Type", "Authorization"])
@LoginSignup_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    data = request.get_json()
    email=data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status":"404"})
    if not check_password_hash(user.password, password):
        return jsonify({"status":"401"})
    return jsonify({"status": "200", "user_id":user.id})

@LoginSignup_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    student_num = data.get("studentNum")
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"status":"404"})
    else:
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, student_num=student_num, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"status":"200"}), 201
    
@LoginSignup_bp.route("/profiledelete", methods=["POST"])
def profileDelete():
    data = request.get_json()
    id = data.get("id")
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if (user.id == id and check_password_hash(user.password, password)):
        db.session.delete(user)
        db.session.commit()
        return jsonify({"status": "200"})
    else:
         return jsonify({"status": "404"})
    
    
@LoginSignup_bp.route("/getprofile",methods=["POST"])
def getprofile():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.filter_by(id=user_id).first()

    if user:
        return jsonify({
            "status": "200",
            "user": {
                "name": user.name,
                "email": user.email,
                "student_num":user.student_num,
                "password": hash(user.password)
            }
        })
    else:
        return jsonify({"status": "404"})
    
@LoginSignup_bp.route("/profileedit", methods=["POST"])
def profileEdit():
    data = request.get_json()
    user_id = data.get("user_id")
    name = data.get("name")
    email = data.get("email")

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"status": "404", "message": "User not found"})

    existing_user = User.query.filter(User.email == email, User.id != user_id).first()
    if existing_user:
        return jsonify({"status": "400", "message": "Email already in use"})

    if not check_password_hash(user.password, old_password):
        return jsonify({"status": "401", "message": "Incorrect old password"})

    user.name = name
    if new_password:
        user.password = generate_password_hash(new_password)

    db.session.commit()
    return jsonify({"status": "200", "message": "Profile updated successfully"})