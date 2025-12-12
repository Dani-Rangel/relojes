# backend/app/routes/facturas.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.factura import Factura, MetodoPagoEnum, EstadoFacturaEnum
from ..models.cliente import Cliente
from ..models.empleado import Empleado
from datetime import datetime

facturas_bp = Blueprint('facturas', __name__)

@facturas_bp.route('/api/facturas', methods=['GET'])
def get_facturas():
    try:
        db = SessionLocal()
        facturas = db.query(Factura).all()
        
        result = []
        for f in facturas:
            result.append({
                "id": f.id,
                "serie": f.serie,
                "folio": f.folio,
                "id_cliente": f.id_cliente,
                "cliente_nombre": f.cliente.nombre if f.cliente else "N/A",
                "id_empleado": f.id_empleado,
                "empleado_nombre": f.empleado.nombre if f.empleado else "N/A",
                "fecha_emision": f.fecha_emision.isoformat(),
                "fecha_pago": f.fecha_pago.isoformat() if f.fecha_pago else None,
                "subtotal": float(f.subtotal),
                "impuestos": float(f.impuestos),
                "total": float(f.total),
                "metodo_pago": f.metodo_pago.value,
                "estado": f.estado.value
            })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ ERROR EN /api/facturas: {e}")
        return jsonify({"error": "Error interno"}), 500
    finally:
        db.close()

@facturas_bp.route('/api/facturas/<int:factura_id>', methods=['GET'])
def get_factura_detalle(factura_id):
    try:
        db = SessionLocal()
        factura = db.query(Factura).filter(Factura.id == factura_id).first()
        
        if not factura:
            return jsonify({"error": "Factura no encontrada"}), 404

        return jsonify({
            "id": factura.id,
            "serie": factura.serie,
            "folio": factura.folio,
            "id_cliente": factura.id_cliente,
            "cliente_nombre": f"{factura.cliente.nombre} {factura.cliente.apellido}" if factura.cliente else "N/A",
            "cliente_email": factura.cliente.email if factura.cliente else "",
            "id_empleado": factura.id_empleado,
            "empleado_nombre": f"{factura.empleado.nombre} {factura.empleado.apellido}" if factura.empleado else "N/A",
            "fecha_emision": factura.fecha_emision.isoformat(),
            "fecha_pago": factura.fecha_pago.isoformat() if factura.fecha_pago else None,
            "subtotal": float(factura.subtotal),
            "impuestos": float(factura.impuestos),
            "total": float(factura.total),
            "metodo_pago": factura.metodo_pago.value,
            "estado": factura.estado.value,
            "notas": factura.notas
        }), 200
    except Exception as e:
        print(f"❌ ERROR EN /api/facturas/{factura_id}: {e}")
        return jsonify({"error": "Error interno"}), 500
    finally:
        db.close()

@facturas_bp.route('/api/facturas', methods=['POST'])
def crear_factura():
    try:
        from ..models.factura import Factura, MetodoPagoEnum, EstadoFacturaEnum
        from datetime import datetime

        data = request.get_json()
        required = ['id_cliente', 'id_empleado', 'subtotal', 'impuestos', 'total', 'metodo_pago', 'serie', 'folio']
        
        for field in required:
            if field not in data:
                return jsonify({"error": f"Campo '{field}' es requerido"}), 400

        db = SessionLocal()
        try:
            # Validar cliente y empleado
            cliente = db.query(Cliente).filter(Cliente.id == data['id_cliente']).first()
            empleado = db.query(Empleado).filter(Empleado.id == data['id_empleado']).first()
            
            if not cliente:
                return jsonify({"error": "Cliente no encontrado"}), 404
            if not empleado:
                return jsonify({"error": "Empleado no encontrado"}), 404

            # Crear factura
            factura = Factura(
                id_cliente=data['id_cliente'],
                id_empleado=data['id_empleado'],
                id_pedido=data.get('id_pedido'),
                subtotal=float(data['subtotal']),
                impuestos=float(data['impuestos']),
                total=float(data['total']),
                metodo_pago=MetodoPagoEnum(data['metodo_pago']),
                estado=EstadoFacturaEnum.PAGADA if data.get('pagada') else EstadoFacturaEnum.EMITIDA,
                serie=data['serie'],
                folio=int(data['folio']),
                fecha_emision=datetime.now(),
                fecha_pago=datetime.now() if data.get('pagada') else None
            )
            
            db.add(factura)
            db.commit()
            db.refresh(factura)
            
            return jsonify({
                "message": "Factura creada exitosamente",
                "factura_id": factura.id,
                "serie": factura.serie,
                "folio": factura.folio
            }), 201

        finally:
            db.close()

    except Exception as e:
        print(f"❌ ERROR EN /api/facturas POST: {e}")
        return jsonify({"error": "Error interno"}), 500        