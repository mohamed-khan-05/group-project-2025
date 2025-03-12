from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User, Orders

Cart_bp = Blueprint("Cart_bp", __name__)

@Cart_bp.route("/addtocart", methods=["POST"])
def addtocart():
    data = request.get_json()
    book_id = data.get("book_id")
    user_id = data.get("user_id")
    quantity = data.get("quantity")
    total = data.get("total")
    discount_amount = data.get("discount_amount")

    cart = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()
    
    if cart:
        return jsonify({"message": "fail"})

    new_cart = Cart(
        user_id=user_id,
        book_id=book_id,
        quantity=quantity,
        total=total,
        discount_amount=discount_amount
    )
    db.session.add(new_cart)
    db.session.commit()
    return jsonify({"message": "success"})

@Cart_bp.route("/incart", methods=["POST"])
def incart():
    data = request.get_json()
    book_id = data.get("book_id")
    user_id = data.get("user_id")

    cart = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()
    return jsonify({"incart": bool(cart)})

@Cart_bp.route("/remove", methods=["POST"])
def remove():
    data = request.get_json()
    book_id = data.get("book_id")
    user_id = data.get("user_id")

    cart = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()
    if cart:
        db.session.delete(cart)
        db.session.commit()
        return jsonify({"message": "success"})
    return jsonify({"message": "failed"})

@Cart_bp.route("getcartamount",methods=["POST"])
def getcart():
    data = request.get_json()
    user_id = data.get("user_id")

    cart = Cart.query.filter_by(user_id=user_id).count()
    if cart:
        return jsonify({"cart":cart})
    else:
        return jsonify({"cart":0})