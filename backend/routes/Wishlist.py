from flask import jsonify, request, Blueprint
from config import db
from models import db, Wishlist, Book, User

Wishlist.route('/add', methods=['POST'])
def add_to_wishlist():
    data = request.json
    user_id = data.get('user_id')
    book_id = data.get('book_id')

    if not user_id or not book_id:
        return jsonify({'error': 'Missing user_id or book_id'}), 400

    wishlist_item = Wishlist(user_id=user_id, book_id=book_id)
    try:
        db.session.add(wishlist_item)
        db.session.commit()
        return jsonify({'message': 'Book added to wishlist'}), 201
    except:
        db.session.rollback()
        return jsonify({'error': 'Book is already in wishlist'}), 400

Wishlist.route('/remove', methods=['POST'])
def remove_from_wishlist():
    data = request.json
    user_id = data.get('user_id')
    book_id = data.get('book_id')

    wishlist_item = Wishlist.query.filter_by(user_id=user_id, book_id=book_id).first()
    if wishlist_item:
        db.session.delete(wishlist_item)
        db.session.commit()
        return jsonify({'message': 'Book removed from wishlist'}), 200

    return jsonify({'error': 'Book not found in wishlist'}), 404
