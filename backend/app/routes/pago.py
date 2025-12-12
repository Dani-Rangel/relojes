# backend/app/routes/pago.py
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

pago_bp = Blueprint("pago", __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

@pago_bp.route("/api/pago", methods=["POST"])
def procesar_pago_cliente():
    db = SessionLocal()
    try:
        # ✅ 1. Validar que sea un cliente autenticado
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token de autorización requerido"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            cliente_id = payload.get("user_id")
            role = payload.get("role")
            if role != "cliente":
                return jsonify({"error": "Solo clientes pueden usar este endpoint"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        # ✅ 2. Cargar cliente
        cliente = db.query(Cliente).filter_by(id=cliente_id, activo=True).first()
        if not cliente:
            return jsonify({"error": "Cliente no encontrado"}), 404

        # ✅ 3. Obtener un vendedor activo (prioridad: vendedor > gerente > admin)
        vendedor = db.query(Empleado).filter(
            Empleado.activo == True,
            Empleado.estado == "aprobado",
            Empleado.cargo.in_(["vendedor", "gerente", "administrador"])
        ).order_by(
            Empleado.cargo.in_(["vendedor", "gerente", "administrador"]).desc()  # vendedor primero
        ).first()

        if not vendedor:
            return jsonify({"error": "No hay empleados disponibles para procesar el pedido"}), 500

        # ✅ 4. Leer productos del body
        data = request.get_json()
        productos = data.get("productos", [])
        if not isinstance(productos, list) or len(productos) == 0:
            return jsonify({"error": "Lista 'productos' requerida"}), 400

        # ✅ 5. Validar stock y calcular total
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

        # ✅ 6. Crear pedido (cliente + vendedor)
        pedido = Pedido(
            id_cliente=cliente.id,
            id_empleado=vendedor.id,
            estado=EstadoPedidoEnum.CONFIRMADO,
            fecha_pedido=datetime.now(),
            total=total
        )
        db.add(pedido)
        db.flush()

        # ✅ 7. Crear factura
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

        # ✅ 8. Confirmar
        db.commit()

        return jsonify({
            "message": "Pago procesado exitosamente",
            "id_pedido": pedido.id,
            "id_factura": factura.id,
            "serie": factura.serie,
            "folio": folio,
            "vendedor": f"{vendedor.nombre} {vendedor.apellido}"
        }), 201

    except Exception as e:
        db.rollback()
        print("❌ ERROR EN /api/pago:", repr(e))
        return jsonify({"error": "Error interno al procesar el pago"}), 500
    finally:
        db.close()