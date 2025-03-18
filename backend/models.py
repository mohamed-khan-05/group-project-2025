from config import db
from datetime import datetime, timezone

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    student_num = db.Column(db.String(10), nullable=False)

    orders = db.relationship('Orders', backref='user', lazy=True, cascade='all, delete')
    wishlist_items = db.relationship('Wishlist', backref='user', lazy=True, cascade='all, delete')
    cart_items = db.relationship('Cart', backref='user', lazy=True, cascade='all, delete')

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    discount = db.Column(db.Numeric(5, 2), nullable=False, default=0)
    image = db.Column(db.String(300), default="BookPlaceholder.png")

    reviews = db.relationship('Review', backref='book', lazy=True, cascade='all, delete')


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer)
    purchase_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    purchase_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(100), default="Pending")

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(5, 2), nullable=False, default=0)

    book = db.relationship('Book', backref='cart_items', lazy=True)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))