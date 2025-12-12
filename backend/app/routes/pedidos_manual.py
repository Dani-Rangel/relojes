# backend/app/routes/pedidos_manual.py
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

pedidos_manual_bp = Blueprint("pedidos_manual", __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

@pedidos_manual_bp.route("/api/pedido/manual", methods=["POST"])
def crear_pedido_manual():
    db = SessionLocal()
    try:
        # 1. Validar token y que sea gerente/admin
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token de autorización requerido"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            usuario_id = payload.get("user_id")
            role = payload.get("role")
            cargo = payload.get("cargo")
            if not (role == "empleado" and cargo in ["gerente", "administrador"]):
                return jsonify({"error": "Solo gerentes o administradores pueden usar este endpoint"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        # 2. Leer datos
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        id_cliente = data.get("id_cliente")
        id_vendedor = data.get("id_vendedor")  # 👈 Opcional — si se pasa, se usa; si no, se busca uno
        productos = data.get("productos", [])

        if not id_cliente:
            return jsonify({"error": "id_cliente es requerido"}), 400
        if not isinstance(productos, list) or len(productos) == 0:
            return jsonify({"error": "Lista 'productos' requerida"}), 400

        # 3. Validar cliente
        cliente = db.query(Cliente).filter_by(id=id_cliente, activo=True).first()
        if not cliente:
            return jsonify({"error": "Cliente no encontrado"}), 404

        # 4. Obtener vendedor: primero el especificado, luego por defecto
        vendedor = None
        if id_vendedor:
            vendedor = db.query(Empleado).filter_by(
                id=id_vendedor,
                cargo="vendedor",
                activo=True,
                estado="aprobado"
            ).first()
            if not vendedor:
                return jsonify({"error": f"Vendedor con ID {id_vendedor} no encontrado o inactivo"}), 404
        else:
            # Buscar primer vendedor activo
            vendedor = db.query(Empleado).filter_by(
                cargo="vendedor",
                activo=True,
                estado="aprobado"
            ).first()
            if not vendedor:
                return jsonify({"error": "No hay vendedores disponibles"}), 500

        # 5. Validar stock y calcular total
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
            id_empleado=vendedor.id,
            estado=EstadoPedidoEnum.CONFIRMADO,
            fecha_pedido=datetime.now(),
            total=total
        )
        db.add(pedido)
        db.flush()

        # 7. Crear factura (pagada)
        folio = pedido.id
        factura = Factura(
            id_cliente=cliente.id,
            id_empleado=vendedor.id,
            id_pedido=pedido.id,
            subtotal=total,
            impuestos=total * 0.16,
            total=total * 1.16,
            metodo_pago=MetodoPagoEnum.TARJETA,
            estado="pagada",
            serie="FAC-2025",
            folio=folio,
            fecha_emision=datetime.now(),
            fecha_pago=datetime.now()
        )
        db.add(factura)

        # 8. Confirmar
        db.commit()

        return jsonify({
            "message": "Pedido y factura creados exitosamente",
            "id_pedido": pedido.id,
            "id_factura": factura.id,
            "vendedor": f"{vendedor.nombre} {vendedor.apellido}",
            "cliente": f"{cliente.nombre} {cliente.apellido}"
        }), 201

    except Exception as e:
        db.rollback()
        print("❌ ERROR EN /api/pedido/manual:", repr(e))
        return jsonify({"error": "Error interno"}), 500
    finally:
        db.close()