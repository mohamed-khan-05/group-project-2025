from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

LoginSignup_bp = Blueprint('login_signup', __name__)

    
@LoginSignup_bp.route("/login", methods=["POST"])
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
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"status":"404"})
    else:
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password)
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
                "password": hash(user.password)
            }
        })
    else:
        return jsonify({"status": "404"})