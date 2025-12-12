from flask import Blueprint, jsonify, request
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.empleado import Empleado, EstadoEmpleadoEnum

empleados_bp = Blueprint('empleados', __name__)

@empleados_bp.route('/api/empleados/pendientes', methods=['GET'])
def get_empleados_pendientes():
    db = SessionLocal()
    try:
        empleados = db.query(Empleado).filter(
            Empleado.estado == EstadoEmpleadoEnum.PENDIENTE
        ).all()
        
        return jsonify([{
            "id": e.id,
            "nombre": f"{e.nombre} {e.apellido}",
            "cargo": e.cargo.value,
            "email": e.email,
            "fecha_ingreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None
        } for e in empleados]), 200
    finally:
        db.close()

@empleados_bp.route('/api/empleados/<int:empleado_id>/aprobar', methods=['POST'])
def aprobar_empleado(empleado_id):
    db = SessionLocal()
    try:
        empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if not empleado:
            return jsonify({"error": "Empleado no encontrado"}), 404
            
        empleado.estado = EstadoEmpleadoEnum.APROBADO
        empleado.activo = True
        db.commit()
        
        return jsonify({"message": "Empleado aprobado exitosamente"}), 200
    finally:
        db.close()