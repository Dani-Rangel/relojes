from flask import Blueprint, jsonify, request 
from sqlalchemy.orm import Session
import jwt  # ✅ Añade jwt
import os 
from ..models.base import SessionLocal
from ..models.empleado import Empleado, EstadoEmpleadoEnum

empleados_bp = Blueprint('empleados', __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

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

@empleados_bp.route('/api/empleados/vendedores', methods=['GET'])
def get_vendedores_activos():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if not (payload.get("role") == "empleado" and payload.get("cargo") in ["gerente", "administrador"]):
            return jsonify({"error": "Acceso denegado"}), 403
    except:
        return jsonify({"error": "Token inválido"}), 401

    db = SessionLocal()
    try:
        vendedores = db.query(Empleado).filter(
            Empleado.cargo == "vendedor",
            Empleado.activo == True,
            Empleado.estado == "aprobado"
        ).all()
        return jsonify([{
            "id": v.id,
            "nombre": v.nombre,
            "apellido": v.apellido,
            "email": v.email
        } for v in vendedores])
    finally:
        db.close()        