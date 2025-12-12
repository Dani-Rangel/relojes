# backend/app/routes/pedidos.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.pedido import Pedido, EstadoPedidoEnum
from ..models.factura import Factura, MetodoPagoEnum
from ..models.producto import Producto
from ..models.cliente import Cliente
from ..models.empleado import Empleado
from datetime import datetime
import jwt
import os

pedidos_bp = Blueprint("pedidos", __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

@pedidos_bp.route("/api/pedidos", methods=["POST"])
def crear_pedido():
    db = SessionLocal()
    try:
        # 1. Validar token de autorización
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token de autorización requerido"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            empleado_id = payload.get("user_id")
            role = payload.get("role")
            if role != "empleado":
                return jsonify({"error": "Solo empleados pueden crear pedidos"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        # 2. Cargar empleado autenticado
        empleado = db.query(Empleado).filter_by(id=empleado_id, activo=True).first()
        if not empleado:
            return jsonify({"error": "Empleado no encontrado o inactivo"}), 404

        # 3. Leer datos del cuerpo
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        id_cliente = data.get("id_cliente")
        productos = data.get("productos")

        if not id_cliente:
            return jsonify({"error": "Campo 'id_cliente' es requerido"}), 400
        if not isinstance(productos, list) or len(productos) == 0:
            return jsonify({"error": "Lista 'productos' requerida y no vacía"}), 400

        # 4. Validar cliente
        cliente = db.query(Cliente).filter_by(id=id_cliente, activo=True).first()
        if not cliente:
            return jsonify({"error": "Cliente no encontrado o inactivo"}), 404

        # 5. Calcular total y validar stock (opcional: puedes añadir verificación de stock después)
        total = 0.0
        for item in productos:
            id_producto = item.get("id_producto")
            cantidad = item.get("cantidad", 1)
            if not id_producto or cantidad < 1:
                return jsonify({"error": "Cada producto debe tener 'id_producto' y 'cantidad' ≥ 1"}), 400

            producto = db.query(Producto).filter_by(id=id_producto).first()
            if not producto:
                return jsonify({"error": f"Producto con ID {id_producto} no encontrado"}), 404
            if producto.stock < cantidad:
                return jsonify({
                    "error": f"Stock insuficiente para '{producto.nombre}'. Disponible: {producto.stock}"
                }), 400

            total += producto.precio * cantidad

        # 6. Crear pedido
        pedido = Pedido(
            id_cliente=cliente.id,
            id_empleado=empleado.id,
            estado=EstadoPedidoEnum.PENDIENTE,
            fecha_pedido=datetime.now(),
            total=total
        )
        db.add(pedido)
        db.flush()  # Obtiene el ID del pedido

        # 7. Crear factura
        folio = pedido.id  # O usa un contador secuencial si necesitas folios únicos por serie
        factura = Factura(
            id_cliente=cliente.id,
            id_empleado=empleado.id,
            id_pedido=pedido.id,
            subtotal=total,
            impuestos=total * 0.16,
            total=total * 1.16,
            metodo_pago=MetodoPagoEnum.EFECTIVO,
            estado="emitida",  # EstadoFacturaEnum.EMITIDA
            serie="FAC-2025",
            folio=folio
        )
        db.add(factura)

        # 8. Confirmar
        db.commit()

        return jsonify({
            "message": "Pedido y factura creados exitosamente",
            "id_pedido": pedido.id,
            "id_factura": factura.id,
            "serie": factura.serie,
            "folio": folio
        }), 201

    except Exception as e:
        db.rollback()
        print("❌ ERROR EN /api/pedidos:", repr(e))
        return jsonify({"error": "Error interno al procesar el pedido"}), 500

    finally:
        db.close()