from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask(__name__)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://devdynamos-bookstore.netlify.app"]}}) 

UPLOAD_FOLDER = 'uploads/books'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///bookstore.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False

@app.route('/uploads/books/<filename>')
def uploaded_book_file(filename):
    return send_from_directory('uploads/books', filename)


db=SQLAlchemy(app)