from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.auth import auth_bp
    from .routes.productos import productos_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(productos_bp)

    return app