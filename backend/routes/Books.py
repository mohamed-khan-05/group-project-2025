import datetime
import os
from config import app
from flask import Blueprint, jsonify, request
from models import db, Book, Review, User
from werkzeug.utils import secure_filename

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