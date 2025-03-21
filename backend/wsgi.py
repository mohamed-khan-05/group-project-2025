from config import app, db
from flask import request

with app.app_context():
    db.create_all()

# if __name__ == "__main__":
#     app.run()
