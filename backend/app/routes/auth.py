from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..services.auth_service import authenticate_user, get_password_hash
import jwt
from datetime import datetime, timezone, timedelta
import os
from ..models.cliente import Cliente
from ..models.empleado import Empleado, CargoEnum
from datetime import date

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "relojes_premium_2025_jwt_secret_key_min_32_chars")

def create_token(user_data: dict) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_data["id"],
        "role": user_data["role"],
        "email": user_data["email"],
        "iat": now,
        "exp": now + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@auth_bp.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "Relojes API"})

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Email y contraseña son requeridos"}), 400

        db = SessionLocal()
        try:
            user = authenticate_user(db, email, password)
            if not user:
                return jsonify({"error": "Credenciales incorrectas"}), 401

            token = create_token(user)
            return jsonify({
                "token": token,
                "user": {
                    "id": user["id"],
                    "nombre": user["nombre"],
                    "email": user["email"],
                    "role": user["role"],
                    "cargo": user.get("cargo")
                }
            }), 200
        finally:
            db.close()

    except Exception as e:
        print(f"❌ ERROR EN /api/login: {type(e).__name__}: {e}")
        return jsonify({"error": "Error interno"}), 500

@auth_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        required = ['nombre', 'apellido', 'email', 'password']
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"Campo '{field}' es requerido"}), 400

        db = SessionLocal()
        try:
            existing = db.query(Cliente).filter(
                Cliente.email.ilike(data['email'])
            ).first()
            if existing:
                return jsonify({"error": "Este email ya está registrado"}), 409

            cliente = Cliente(
                nombre=data['nombre'].strip(),
                apellido=data['apellido'].strip(),
                email=data['email'].strip().lower(),
                telefono=data.get('telefono', '').strip(),
                direccion=data.get('direccion', '').strip(),
                fecha_registro=date.today(),
                activo=True,
                password_hash=get_password_hash(data['password'])
            )
            
            db.add(cliente)
            db.commit()
            db.refresh(cliente)
            
            return jsonify({
                "message": "Cliente registrado exitosamente",
                "cliente_id": cliente.id
            }), 201

        finally:
            db.close()

    except Exception as e:
        print(f"❌ ERROR EN /api/register: {e}")
        return jsonify({"error": "Error interno"}), 500

@auth_bp.route('/api/register/empleado', methods=['POST'])
def register_empleado():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        required = ['nombre', 'apellido', 'email', 'password', 'cargo']
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"Campo '{field}' es requerido"}), 400

        try:
            cargo = CargoEnum(data['cargo'].lower())
        except ValueError:
            return jsonify({
                "error": "Cargo inválido",
                "validos": [c.value for c in CargoEnum]
            }), 400

        db = SessionLocal()
        try:
            existing = db.query(Empleado).filter(
                Empleado.email.ilike(data['email'])
            ).first()
            if existing:
                return jsonify({"error": "Este email ya está registrado para un empleado"}), 409

            empleado = Empleado(
                nombre=data['nombre'].strip(),
                apellido=data['apellido'].strip(),
                email=data['email'].strip().lower(),
                cargo=cargo,
                salario=float(data.get('salario', 0)),
                fecha_ingreso=date.today(),
                activo=True,
                password_hash=get_password_hash(data['password'])
            )

            db.add(empleado)
            db.commit()
            db.refresh(empleado)

            return jsonify({
                "message": "Empleado registrado exitosamente",
                "empleado_id": empleado.id,
                "cargo": empleado.cargo.value
            }), 201

        finally:
            db.close()

    except Exception as e:
        print(f"❌ ERROR EN /api/register/empleado: {e}")
        return jsonify({"error": "Error interno"}), 500