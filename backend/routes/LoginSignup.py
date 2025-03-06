from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

LoginSignup_bp = Blueprint('login_signup', __name__)