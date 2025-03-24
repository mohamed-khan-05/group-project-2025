from flask import Blueprint, jsonify, request
from models import db, Book, Review, User

Filter_bp = Blueprint("Filter_bp", __name__)

@Filter_bp.route("/getfilters", methods=["GET"])
def getfilters():
    categories = db.session.query(Book.category).distinct().all()
    category_set = set()
    for category in categories:
        if category[0]:
            split_categories = [c.strip() for c in category[0].split(",")]
            category_set.update(split_categories)

    return jsonify({"categories": sorted(category_set)})