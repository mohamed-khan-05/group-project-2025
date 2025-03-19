from flask import request, jsonify
from config import app, db
from models import User, Book, Orders, Cart, Wishlist, Review

from routes.LoginSignup import LoginSignup_bp
app.register_blueprint(LoginSignup_bp)
from routes.Books import Books_bp
app.register_blueprint(Books_bp, url_prefix="/books")
from routes.Reviews import Reviews_bp
app.register_blueprint(Reviews_bp, url_prefix="/reviews")
from routes.Wishlist import Wishlist_bp
app.register_blueprint(Wishlist_bp, url_prefix="/wishlist")
from routes.Cart import Cart_bp
app.register_blueprint(Cart_bp, url_prefix="/cart")
from routes.Orders import Orders_bp
app.register_blueprint(Orders_bp, url_prefix="/orders")
from routes.Filter import Filter_bp
app.register_blueprint(Filter_bp, url_prefix="/filter")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    # app.run(port=5000)