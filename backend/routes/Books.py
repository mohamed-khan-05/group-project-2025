import datetime
import os
from config import app
from flask import Blueprint, jsonify, request
from models import db, Book, Review, User, Orders
from sqlalchemy import func
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL")

Books_bp = Blueprint("Books_bp", __name__)

@Books_bp.route("/addbook", methods=["POST"])
def addbook():
    title = request.form.get("title")
    description = request.form.get("description")
    author = request.form.get("author")
    category = request.form.get("category")
    quantity = request.form.get("quantity", type=int)
    price = request.form.get("price", type=float)
    discount = request.form.get("discount", type=float, default=0)
    image = request.files.get("image")

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    if image:
        filename = secure_filename(image.filename)
        name, extension = os.path.splitext(filename)
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        image_filename = f"{timestamp}_{name}{extension}"
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
    else:
        image_filename = "BookPlaceholder.png"

    new_book = Book(
        title=title,
        description=description,
        author=author,
        category=category,
        quantity=quantity,
        price=price,
        discount=discount,
        image=image_filename
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"status":"200"})

@Books_bp.route("/getallbooks", methods=["GET"])
def getall():
    books = Book.query.all()
    books_list = []
    for book in books:
        books_list.append({
            "id": book.id,
            "title": book.title,
            "description": book.description,
            "author": book.author,
            "category": book.category,
            "price":book.price,
            "discount":book.discount,
            "quantity": book.quantity,
            "image": f"{BASE_URL}/uploads/books/{book.image}"
        })
    return jsonify(books_list)

@Books_bp.route("/getbookdetails",methods=["POST"])
def getbookdetails():
    data = request.get_json()
    book_id = data.get("book_id")

    book=Book.query.filter_by(id=book_id).first()
    if (book):
        book_details={
            "id": book.id,
            "title": book.title,
            "description": book.description,
            "author": book.author,
            "category": book.category,
            "price":book.price,
            "discount":book.discount,
            "quantity": book.quantity,
            "image": f"{BASE_URL}/uploads/books/{book.image}"
        }
        reviews_list = []
        for review in book.reviews:
            user = User.query.get(review.user_id)
            reviews_list.append({
                "review_id": review.id,
                "user_id": review.user_id,
                "user_name": user.name if user else "Unknown",
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify({
            "status": "200",
            "book": book_details,
            "reviews": reviews_list
        })
    else:
        return jsonify({"status": "404", "message": "Book not found"})
    
@Books_bp.route("/editbook", methods=["POST"])
def editbook():
    book_id = request.form.get("book_id")
    title = request.form.get("title")
    description = request.form.get("description")
    author = request.form.get("author")
    category = request.form.get("category")
    quantity = request.form.get("quantity", type=int)
    price = request.form.get("price", type=float)
    discount = request.form.get("discount", type=float, default=0)
    image = request.files.get("image")

    book = Book.query.filter_by(id=book_id).first()
    if not book:
        return jsonify({"status": "404", "message": "Book not found"})

    book.title = title
    book.description = description
    book.author = author
    book.category = category
    book.quantity = quantity
    book.price = price
    book.discount = discount

    if image:
        if book.image != "BookPlaceholder.png":
            old_image_path = os.path.join(app.config["UPLOAD_FOLDER"], book.image)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        filename = secure_filename(image.filename)
        name, extension = os.path.splitext(filename)
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        image_filename = f"{timestamp}_{name}{extension}"
        image.save(os.path.join(app.config["UPLOAD_FOLDER"], image_filename))
        book.image = image_filename
    db.session.commit()

    return jsonify({"status": "200", "message": "Book updated successfully"})

@Books_bp.route("/deletebook", methods=["POST"])
def deletebook():
    data = request.get_json()
    book_id = data.get("book_id")

    book = Book.query.filter_by(id=book_id).first()

    if not book:
        return jsonify({"message":"Book not found"})
    else:
        book.quantity=0
        db.session.commit()
        return jsonify({"message":"book deleted"})
    
@Books_bp.route("/popular", methods=["GET"])
def popular():
    pop_books = db.session.query(
        Orders.book_id, 
        func.sum(Orders.quantity).label('total_quantity')
    ).group_by(Orders.book_id)  \
    .order_by(func.sum(Orders.quantity).desc()) \
    .limit(3)

    popular_books = []
    for book_order in pop_books:
        book = Book.query.get(book_order.book_id)
        popular_books.append({
            "id": book.id,
            "title": book.title,
            "description": book.description,
            "author": book.author,
            "category": book.category,
            "price":book.price,
            "discount":book.discount,
            "quantity": book.quantity,
            "image": f"{BASE_URL}/uploads/books/{book.image}"
        })
    
    return jsonify(popular_books)