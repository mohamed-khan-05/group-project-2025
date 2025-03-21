from flask import jsonify, request, Blueprint
from models import db, Wishlist, Book, User
import os

Wishlist_bp = Blueprint("Wishlist_bp", __name__)

BASE_URL = os.getenv("BASE_URL")

@Wishlist_bp.route("/addtowishlist", methods=["POST"])
def addtowishlist():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    book = Book.query.filter_by(id=book_id).first()
    user = User.query.filter_by(id=user_id).first()

    if book is None or user is None:
        return jsonify({"status":"404"})
    
    wishlist = Wishlist(
        user_id=user_id,
        book_id=book_id
    )
    db.session.add(wishlist)
    db.session.commit()
    return jsonify({"status":"200"})

@Wishlist_bp.route("/getwishlist", methods=["POST"])
def getwishlist():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.get(user_id)

    if not user:
        return jsonify({"status": "404", "wishlist": None})

    wishlist = []
    for item in user.wishlist_items:
        book = Book.query.get(item.book_id)
        if book:
            wishlist.append({
                "id": book.id,
                "title": book.title,
                "description": book.description,
                "author": book.author,
                "category": book.category,
                "price": book.price,
                "discount": book.discount,
                "quantity": book.quantity,
                "image": f"{BASE_URL}/uploads/books/{book.image}"
            })

    return jsonify({
        "status": "200",
        "wishlist": wishlist
    })


@Wishlist_bp.route("/inlist", methods=["POST"])
def inlist():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    item = Wishlist.query.filter_by(user_id=user_id, book_id=book_id).first()

    if (item):
        return jsonify({"inlist":True})
    else:
        return jsonify({"inlist":False})

@Wishlist_bp.route("/remove", methods=["POST"])
def remove():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    user = User.query.get(user_id)

    if not user:
        return jsonify({"status": "404", "message": "User not found"})

    item_to_remove = None
    for item in user.wishlist_items:
        if item.book_id == book_id:
            item_to_remove = item
            break

    if not item_to_remove:
        return jsonify({"status": "404"})

    db.session.delete(item_to_remove)
    db.session.commit()

    return jsonify({"status": "200"})
