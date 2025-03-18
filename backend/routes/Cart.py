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

@Cart_bp.route("/paystack-webhook", methods=["POST"])
def paystack_webhook():
    event = request.get_json()
    print("Webhook Received:", event)
    return jsonify({"status": "received"}), 200

@Cart_bp.route("/get-user-email", methods=["GET"])
def get_user_email():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"email": user.email})

FRONTEND_URL = os.getenv("FRONTEND_URL")

@Cart_bp.route("/create-paystack-transaction", methods=["POST"])
def create_paystack_transaction():
    data = request.get_json()
    amount = data.get("amount")
    email = data.get("email")
    user_id = data.get("user_id")

    if not amount or not email:
        return jsonify({"error": "Missing amount or email"}), 400

    try:
       amount = int(round(float(amount) * 100))
    except ValueError:
        return jsonify({"error": "Invalid amount format"}), 400

    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}", "Content-Type": "application/json"}
    payload = {"email": email, "amount": amount,"currency": "ZAR",
        "callback_url": f"{FRONTEND_URL}payment-success?user_id={user_id}",}

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
    
    print(f"Verifying reference: {reference}")  # Debug log
    
    if not reference:
        return jsonify({"error": "Missing payment reference"}), 400

    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    try:
        response = requests.get(f"{PAYSTACK_VERIFY_URL}{reference}", headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
    except Exception as e:
        print(f"Paystack API Error: {str(e)}")
        return jsonify({"error": "Payment gateway error", "details": str(e)}), 500

    result = response.json()
    print("Paystack Verification Response:", result)  # Debug log

    if response.status_code == 200 and result.get("data", {}).get("status") == "success":
        try:
            # Create order from actual transaction data
            amount = result["data"]["amount"] / 100  # Convert from kobo
            email = result["data"]["customer"]["email"]
            
            new_order = Orders(
                user_id=1,  # Replace with actual user ID from session
                book_id=1,  # Replace with actual book ID from cart
                quantity=1,
                purchase_amount=amount,
                discount_amount=0
            )
            db.session.add(new_order)
            db.session.commit()
            return jsonify({"message": "Payment successful", "status": "success"})
        
        except Exception as e:
            db.session.rollback()
            print(f"Order Creation Error: {str(e)}")
            return jsonify({"error": "Order creation failed", "details": str(e)}), 500
    
    return jsonify({"error": "Payment verification failed", "details": result}), 400

@Cart_bp.route("/update-quantity", methods=["POST"])
def update_quantity():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")
    quantity = data.get("quantity")

    if not user_id:
        return jsonify({"message": "User not found"}), 408

    cart = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()
    book = Book.query.filter_by(id=book_id).first()

    if not book:
        return jsonify({"message": "Book not found"}), 409

    if cart is None:
        return jsonify({"message": "Cart not found"}), 404

    if quantity > book.quantity:
        return jsonify({"message": "Out of stock"}), 400

    if (quantity < 1):
        db.session.delete(cart)
        db.session.commit()
        return jsonify({"message": "Item removed from cart"})

    cart.quantity = quantity
    old_price = cart.quantity * cart.book.price
    new_price = old_price - (old_price*cart.book.discount/100)
    cart.total = round(new_price, 2)

    db.session.commit()
    return jsonify({"message": "Success", "total": cart.total})

@Cart_bp.route("/getamount",methods=["POST"])
def getamount():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    cart = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not cart:
        return jsonify({"quantity":0})
    else:
        return jsonify({"quantity":cart.quantity})