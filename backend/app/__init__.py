from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Registrar todos los blueprints
    from .routes.auth import auth_bp
    from .routes.productos import productos_bp
    from .routes.pedidos import pedidos_bp
    from .routes.facturas import facturas_bp
    from .routes.empleados import empleados_bp
    #from .routes.clientes import clientes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(productos_bp)
    app.register_blueprint(pedidos_bp)
    app.register_blueprint(facturas_bp)
    app.register_blueprint(empleados_bp)
    #app.register_blueprint(clientes_bp)

    return app
