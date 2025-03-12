from flask import Blueprint, jsonify, request
from models import db, Review, Book, User, Orders

Orders_bp = Blueprint("Orders_bp", __name__)

@Orders_bp.route('/getuserorders', methods=['POST'])
def get_user_orders():
    data = request.get_json()
    user_id = data.get("user_id")
    
    orders = Orders.query.filter_by(user_id=user_id).all()

    if (orders is None):
        return jsonify({"orders":None})
    
    order_details = []
    for order in orders:
        
        book = Book.query.get(order.book_id)
        order_data = {
            'order_id': order.id,
            'book_title': book.title,
            'book_author': book.author,
            'quantity': order.quantity,
            'purchase_amount': str(order.purchase_amount),  
            'purchase_date': order.purchase_date.isoformat(),
            'status': order.status
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