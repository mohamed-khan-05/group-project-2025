import os
from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User, Orders
from dotenv import load_dotenv
import requests

load_dotenv()

BASE_URL = os.getenv("BASE_URL")
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")
PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize"
PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/"

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
def getcartamount():
    data = request.get_json()
    user_id = data.get("user_id")

    cart = Cart.query.filter_by(user_id=user_id).count()
    if cart:
        return jsonify({"cart":cart})
    else:
        return jsonify({"cart":0})
    
@Cart_bp.route("/getcart", methods=["POST"])
def getcart():
    data = request.get_json()
    user_id = data.get("user_id")

    cart = Cart.query.filter_by(user_id=user_id).all()
    cart_items = []

    if cart:
        for item in cart:
            book = Book.query.filter_by(id=item.book_id).first()
            cart_items.append({
                "id": item.id,
                "user_id": item.user_id,
                "book_id": item.book_id,
                "quantity": item.quantity,
                "total":item.total,
                "discount":item.discount_amount,
                "book_image": f"{BASE_URL}/uploads/books/{book.image}" if book else f"{BASE_URL}/uploads/books/BookPlaceholder.png",
            })

    return jsonify({"cart": cart_items})

@Cart_bp.route("/get-user-email", methods=["GET"])
def get_user_email():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"email": user.email})

@Cart_bp.route("/create-paystack-transaction", methods=["POST"])
def create_paystack_transaction():
    data = request.get_json()
    amount = data.get("amount")
    email = data.get("email")

    if not amount or not email:
        return jsonify({"error": "Missing amount or email"}), 400

    try:
       amount = int(round(float(amount) * 100))  # Convert ZAR to Kobo
    except ValueError:
        return jsonify({"error": "Invalid amount format"}), 400

    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}", "Content-Type": "application/json"}
    payload = {"email": email, "amount": amount}

    response = requests.post(PAYSTACK_INIT_URL, json=payload, headers=headers)
    result = response.json()

    if response.status_code == 200 and "data" in result:
        return jsonify({
            "authorization_url": result["data"]["authorization_url"],
            "reference": result["data"]["reference"],
        })
    return jsonify({"error": "Failed to initialize payment", "details": result}), 400

@Cart_bp.route("/verify-paystack-payment", methods=["POST"])
def verify_paystack_payment():
    data = request.get_json()
    reference = data.get("reference")

    if not reference:
        return jsonify({"error": "Missing payment reference"}), 400

    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    response = requests.get(f"{PAYSTACK_VERIFY_URL}{reference}", headers=headers)
    result = response.json()

    if response.status_code == 200 and result.get("data", {}).get("status") == "success":
        return jsonify({"message": "Payment successful", "status": "success"})
    
    return jsonify({"error": "Payment verification failed", "details": result}), 400