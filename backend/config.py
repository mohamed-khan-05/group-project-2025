from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask(__name__)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
# CORS(app, resources={r"/*": {"origins": [FRONTEND_URL, "https://devdynamos-bookstore.netlify.app"]}}, supports_credentials=True)
CORS(app)

UPLOAD_FOLDER = 'uploads/books'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///bookstore.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.route('/uploads/books/<filename>')
def uploaded_book_file(filename):
    return send_from_directory('uploads/books', filename)


db=SQLAlchemy(app)