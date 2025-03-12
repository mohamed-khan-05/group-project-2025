import datetime
import os
from config import app
from flask import Blueprint, jsonify, request
from models import db, Book, Review, User
from werkzeug.utils import secure_filename

Books_bp = Blueprint("Books_bp", __name__)

# Define API routes under the Blueprint
@Books_bp.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.filter(Book.quantity > 0).all()  # Fetch books where quantity > 0
    book_list = []
    
    for book in books:
        book_list.append({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'price': str(book.price),  # Convert price to string for JSON serialization
            'image': book.image,
            'quantity': book.quantity,
            'description': book.description
        })
    
    return jsonify(book_list)


