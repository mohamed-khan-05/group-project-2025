from config import app, db
import logging
from flask import request

logging.basicConfig(level=logging.INFO)

@app.before_request
def log_request_info():
    logging.info(f"Incoming request: {request.method} {request.path}")
    logging.info(f"Headers: {request.headers}")

with app.app_context():
    db.create_all()

# if __name__ == "__main__":
#     app.run()
