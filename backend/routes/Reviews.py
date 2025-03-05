from flask import Blueprint, jsonify, request
from models import db, Review, Book, User

Reviews_bp = Blueprint("Reviews_bp", __name__)

@Reviews_bp.route("/addreview", methods=["POST"])
def addreview():
    data = request.get_json()
    book_id = data.get("book_id")
    user_id = data.get("user_id")
    rating = data.get("rating")
    comment = data.get("comment")

    book = Book.query.filter_by(id=book_id).first()
    user = User.query.filter_by(id=user_id).first()

    if book is None or user is None:
        return jsonify({"status":"404"})

    new_review = Review(
        book_id=book_id,
        user_id=user_id,
        rating = rating,
        comment = comment
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"status":"200"})

@Reviews_bp.route("/deletereview", methods=["POST"])
def deletereview():
    data = request.get_json()
    review_id = data.get("review_id")
    user_id = data.get("user_id")

    review = Review.query.filter(Review.user_id == user_id, Review.id==review_id).first()
    if (review):
        db.session.delete(review)
        db.session.commit()
        return jsonify({"status":"200"})
    else:
        return jsonify({"status":"404"})