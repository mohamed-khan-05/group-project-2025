from flask import jsonify, request, Blueprint
from models import db, Wishlist, Book, User

Wishlist_bp = Blueprint("Wishlist_bp", __name__)
