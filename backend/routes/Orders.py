from flask import Blueprint, jsonify, request
from models import db, Review, Book, User, Orders
import os

Orders_bp = Blueprint("Orders_bp", __name__)

BASE_URL=os.getenv("BASE_URL")

@Orders_bp.route('/getuserorders', methods=['POST'])
def get_user_orders():
    data = request.get_json()
    user_id = data.get("user_id")
    
    orders = Orders.query.filter_by(user_id=user_id).order_by(Orders.id.desc()).all()

    if not orders:
        return jsonify({"orders":None})
    
    order_details = []
    for order in orders:
        book = Book.query.get(order.book_id)
        order_data = {
            'order_id': order.id,
            "book_id":order.book_id,
            'book_title': book.title,
            'book_author': book.author,
            'quantity': order.quantity,
            'purchase_amount': str(order.purchase_amount),  
            'purchase_date': order.purchase_date.isoformat(),
            'status': order.status,
            "book_image":f"{BASE_URL}/uploads/books/{book.image}"
        }
        order_details.append(order_data)
    return jsonify({"orders":order_details})

@Orders_bp.route("/addtoorder", methods=["POST"])
def addtoorder():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")
    quantity = data.get("quantity")
    purchase_amount = data.get("purchase_amount")
    discount_amount = data.get("discount_amount")
    status = data.get("status")

    new_order = Orders(user_id=user_id, book_id=book_id, quantity=quantity, purchase_amount=purchase_amount, discount_amount=discount_amount, status=status)
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message":"success"})

@Orders_bp.route('/getallorders', methods=['GET'])
def getallorders():
    orders=Orders.query.order_by(Orders.id.asc()).all()
    orders_list =[]
    for order in orders:
        user = User.query.filter_by(id=order.user_id).first()
        book = Book.query.filter_by(id=order.book_id).first()
        orders_list.append(
            {
                "id":order.id,
                "student_num":user.student_num,
                "user_id":order.user_id,
                "book_id":order.book_id,
                "book_title":book.title,
                "quantity":order.quantity,
                "purchase_date": str(order.purchase_date),
                "purchase_amount":order.purchase_amount,
                "status":order.status
            }
        )
    return jsonify(orders_list)

@Orders_bp.route("/statuschange", methods=["POST"])
def statuschange():
    data = request.get_json()
    order_id = data.get("order_id")

    order = Orders.query.filter_by(id=order_id).first()

    if not order:
        return jsonify({"message":"Not found"})
    else:
        order.status = "Completed"
        db.session.commit()
        return jsonify({"message":"success"})