from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User,Orders

Cart_bp = Blueprint("Cart_bp", __name__)

@Cart_bp.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    
    orders = Orders.query.filter_by(user_id=user_id).all()

    
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

    
    return jsonify(order_details)


