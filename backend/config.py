from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask(__name__)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://devdynamos-bookstore.netlify.app")

CORS(app, resources={r"/*": {"origins": FRONTEND_URL}}, supports_credentials=True, methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

UPLOAD_FOLDER = 'uploads/books'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bookstore.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

@app.route('/uploads/books/<filename>')
def uploaded_book_file(filename):
    return send_from_directory('uploads/books', filename)

db = SQLAlchemy(app)

from routes.LoginSignup import LoginSignup_bp
CORS(LoginSignup_bp)
app.register_blueprint(LoginSignup_bp, url_prefix="/auth")
from routes.Books import Books_bp
CORS(Books_bp)
app.register_blueprint(Books_bp, url_prefix="/books")
from routes.Reviews import Reviews_bp
CORS(Reviews_bp)
app.register_blueprint(Reviews_bp, url_prefix="/reviews")
from routes.Wishlist import Wishlist_bp
CORS(Wishlist_bp)
app.register_blueprint(Wishlist_bp, url_prefix="/wishlist")
from routes.Cart import Cart_bp
CORS(Cart_bp)
app.register_blueprint(Cart_bp, url_prefix="/cart")
from routes.Orders import Orders_bp
CORS(Orders_bp)
app.register_blueprint(Orders_bp, url_prefix="/orders")
from routes.Filter import Filter_bp
CORS(Filter_bp)
app.register_blueprint(Filter_bp, url_prefix="/filter")

@app.after_request
def add_cors_headers(response):
    """Ensure every response includes required CORS headers"""
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "append,delete,entries,foreach,get,has,keys,set,values,Authorization,Content-Type"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Max-Age"]= 86400
    return response
