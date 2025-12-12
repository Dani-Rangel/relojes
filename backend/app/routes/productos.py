# backend/app/routes/productos.py
from flask import Blueprint, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.producto import Producto

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/api/productos', methods=['GET'])
def get_productos():
    try:
        db = SessionLocal()
        productos = db.query(Producto).all()
        
        result = []
        for p in productos:
            result.append({
                "id": p.id,
                "nombre": p.nombre,
                "descripcion": p.descripcion,
                "marca": p.marca,
                "modelo_reloj": p.modelo_reloj,
                "material_caja": p.material_caja,
                "material_correa": p.material_correa,
                "precio": float(p.precio),
                "stock": p.stock,
                "imagen_url": p.imagen_url,
                "proveedor": {
                    "nombre": p.proveedor.nombre_empresa,
                    "contacto": p.proveedor.contacto,
                    "telefono": p.proveedor.telefono
                } if p.proveedor else None
            })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ ERROR EN /api/productos: {e}")
        return jsonify({"error": "Error interno"}), 500
    finally:
        db.close()