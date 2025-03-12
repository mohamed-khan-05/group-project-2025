
from flask import Flask, jsonify
from models import db, Orders, User, Book  
from datetime import datetime

app = Flask(__name__)

@app.route('/api/orders', methods=['GET'])
def get_orders():
    
    orders = Orders.query.all()

    
    order_data = []

    for order in orders:
        
        order_info = {
            'order_id': order.id,
            'user_name': order.user.name,  
            'book_title': order.book.title,  
            'book_author': order.book.author,  
            'quantity': order.quantity,
            'purchase_date': order.purchase_date.isoformat(),  
            'purchase_amount': str(order.purchase_amount),  
            'status': order.status
        }
        order_data.append(order_info)

    
    return jsonify(order_data)

if __name__ == "__main__":
    app.run(debug=True)
