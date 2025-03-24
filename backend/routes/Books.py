import datetime
import os
from config import app
from flask import Blueprint, jsonify, request
from models import db, Book, Review, User
from werkzeug.utils import secure_filename

Books_bp = Blueprint("Books_bp", __name__)

BASE_URL=os.getenv("BASE_URL")

@Books_bp.route("/getbookdetails",methods=["POST"])
def getbookdetails():
    data = request.get_json()
    book_id = data.get("book_id")

    book=Book.query.filter_by(id=book_id).first()
    if (book):
        book_details={
            "id": book.id,
            "title": book.title,
            "description": book.description,
            "author": book.author,
            "category": book.category,
            "price":book.price,
            "discount":book.discount,
            "quantity": book.quantity,
            "image": f"{BASE_URL}/uploads/books/{book.image}"
        }
        reviews_list = []
        for review in book.reviews:
            user = User.query.get(review.user_id)
            reviews_list.append({
                "review_id": review.id,
                "user_id": review.user_id,
                "user_name": user.name if user else "Unknown",
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify({
            "status": "200",
            "book": book_details,
            "reviews": reviews_list
        })
    else:
        return jsonify({"status": "404", "message": "Book not found"})