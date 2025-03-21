from datetime import timedelta
from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask(__name__)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://devdynamos-bookstore.netlify.app")
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})

UPLOAD_FOLDER = 'uploads/books'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///bookstore.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False

@app.route('/uploads/books/<filename>')
def uploaded_book_file(filename):
    return send_from_directory('uploads/books', filename)


db=SQLAlchemy(app)

@app.after_request
def add_cors_headers(response):
    """Ensure every response includes required CORS headers"""
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = jsonify({"message": "Preflight OK"})
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response, 200