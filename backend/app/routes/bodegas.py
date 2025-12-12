# backend/app/routes/bodegas.py
from flask import Blueprint, jsonify
from sqlalchemy.orm import Session
from ..models.base import SessionLocal
from ..models.bodega import Bodega

bodegas_bp = Blueprint('bodegas', __name__)

@bodegas_bp.route('/api/bodegas', methods=['GET'])
def get_bodegas():
    db = SessionLocal()
    try:
        bodegas = db.query(Bodega).all()
        return jsonify([
            {
                "id": b.id,
                "nombre": b.nombre,
                "ubicacion": b.ubicacion,
                "capacidad_max": b.capacidad_max,
                "productos_actuales": b.productos_actuales,
                "encargado": b.encargado or "Sin asignar"
            }
            for b in bodegas
        ]), 200
    finally:
        db.close()