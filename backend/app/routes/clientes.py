# backend/app/routes/clientes.py
from flask import Blueprint, jsonify, request  # ✅ Añade 'request' aquí
import jwt
import os
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.cliente import Cliente

clientes_bp = Blueprint("clientes", __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

@clientes_bp.route('/api/clientes', methods=['GET'])
def get_clientes():
    # ✅ Usa request aquí
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if not (payload.get("role") == "empleado" and payload.get("cargo") in ["gerente", "administrador"]):
            return jsonify({"error": "Acceso denegado"}), 403
    except Exception:
        return jsonify({"error": "Token inválido"}), 401

    db = SessionLocal()
    try:
        clientes = db.query(Cliente).filter_by(activo=True).all()
        return jsonify([{
            "id": c.id,
            "nombre": c.nombre,
            "apellido": c.apellido,
            "email": c.email
        } for c in clientes])
    finally:
        db.close()