from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.pedido import Pedido, EstadoPedidoEnum
from ..models.factura import Factura, MetodoPagoEnum
from ..models.producto import Producto
from ..models.cliente import Cliente
from ..models.empleado import Empleado
from datetime import datetime

pedidos_bp = Blueprint("pedidos", __name__)

@pedidos_bp.route("/api/pedidos", methods=["POST"])
def crear_pedido():
    db = SessionLocal()
    data = request.json

    try:
        cliente = db.query(Cliente).filter_by(id=data["id_cliente"]).first()
        if not cliente:
            return jsonify({"error": "Cliente no encontrado"}), 404

        # asignar empleado automáticamente
        empleado = db.query(Empleado).filter_by(cargo="vendedor").first()

        pedido = Pedido(
            id_cliente=cliente.id,
            id_empleado=empleado.id if empleado else None,
            estado=EstadoPedidoEnum.PENDIENTE,
            fecha_pedido=datetime.now(),
            total=0
        )
        db.add(pedido)
        db.flush()

        total = 0
        for item in data["productos"]:
            producto = db.query(Producto).filter_by(id=item["id_producto"]).first()
            if producto:
                total += producto.precio * item["cantidad"]

        pedido.total = total

        factura = Factura(
            id_cliente=cliente.id,
            id_empleado=empleado.id if empleado else None,
            id_pedido=pedido.id,
            subtotal=total,
            impuestos=total * 0.16,
            total=total * 1.16,
            metodo_pago=MetodoPagoEnum.EFECTIVO,
            serie="FAC-2025",
            folio=pedido.id
        )

        db.add(factura)
        db.commit()

        return jsonify({"message": "Pedido creado con éxito", "id_pedido": pedido.id}), 201

    except Exception as e:
        print("❌ ERROR EN PEDIDO:", e)
        return jsonify({"error": "Error interno"}), 500

    finally:
        db.close()

@pedidos_bp.route("/api/pedidos/cliente/<int:id_cliente>", methods=["GET"])
def pedidos_por_cliente(id_cliente):
    db = SessionLocal()
    try:
        pedidos = db.query(Pedido).filter_by(id_cliente=id_cliente).all()

        return jsonify([
            {
                "id": p.id,
                "fecha_pedido": p.fecha_pedido.isoformat(),
                "estado": p.estado.value,
                "total": p.total
            }
            for p in pedidos
        ])
    except Exception as e:
        print("❌ Error obteniendo pedidos:", e)
        return jsonify({"error": "Error interno"}), 500
    finally:
        db.close()