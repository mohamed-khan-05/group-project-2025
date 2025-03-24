from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User

Cart_bp = Blueprint("Cart_bp", __name__)

from flask import Blueprint, jsonify, request
from models import db, Cart, Book, User

Cart_bp = Blueprint("Cart_bp", __name__)

# Add a book to the cart
@Cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    user_id = request.json.get('user_id')
    book_id = request.json.get('book_id')
    quantity = request.json.get('quantity', 1)

    # Check if the user and book exist
    user = User.query.get(user_id)
    book = Book.query.get(book_id)

    if not user or not book:
        return jsonify({"message": "User or Book not found"}), 404

    # Check if the book already exists in the cart
    cart_item = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()

    if cart_item:
        # If the book is already in the cart, update the quantity
        cart_item.quantity += quantity
    else:
        # Otherwise, add a new cart item
        cart_item = Cart(user_id=user_id, book_id=book_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Book added to cart", "cart_item": cart_item.quantity}), 201


# Remove a book from the cart
@Cart_bp.route('/remove', methods=['DELETE'])
def remove_from_cart():
    user_id = request.json.get('user_id')
    book_id = request.json.get('book_id')

    # Find the cart item
    cart_item = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
         return jsonify({"message": "Book removed from cart"}), 200
    else:
        return jsonify({"message": "Cart item not found"}), 404


# View cart items for a user
@Cart_bp.route('/view', methods=['GET'])
def view_cart():
    user_id = request.args.get('user_id')
  user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Get all cart items for the user
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 200

    # Fetch book details for each cart item
    cart_details = []
    for item in cart_items:
        book = Book.query.get(item.book_id)
        cart_details.append({
            "book_title": book.title,
            "book_author": book.author,
            "book_price": book.price,
            "quantity": item.quantity
        })

    return jsonify({"cart_items": cart_details}), 200


# Clear the cart for a user (optional)
@Cart_bp.route('/clear', methods=['DELETE'])
def clear_cart():
    user_id = request.json.get('user_id')

    # Get all cart items for the user
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"message": "Cart is already empty"}), 200

    for item in cart_items:
        db.session.delete(item)

    db.session.commit()
    return jsonify({"message": "Cart cleared successfully"}), 200