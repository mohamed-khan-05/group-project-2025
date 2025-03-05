from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User

Cart_bp = Blueprint("Cart_bp", __name__)

@Cart_bp.route("/addtocart", methods=["POST"])
def addtocart():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    book = Book.query.filter_by(id=book_id).first()
    user = User.query.filter_by(id=user_id).first()

    if book is None or user is None:
        return jsonify({"status":"404"})
    
    cart = Cart(
        user_id=user_id,
        book_id=book_id
    )
    db.session.add(cart)
    db.session.commit()
    return jsonify({"status":"200"})

@Cart_bp.route("/incart",methods=["POST"])
def incart():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    item = Cart.query.filter_by(user_id=user_id, book_id=book_id)

    if (item):
        return jsonify({"incart":True})
    else:
        return jsonify({"incart":False})
    
@Cart_bp.route("/getcart",methods=["POST"])
def getcart():
    data = request.get_json()
    user_id = data.get("user_id")