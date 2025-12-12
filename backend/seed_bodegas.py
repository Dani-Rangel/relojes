# backend/seed_bodegas.py
from app.models.base import SessionLocal
from app.models.bodega import Bodega
from datetime import date

db = SessionLocal()
try:
    bodegas = [
        Bodega(nombre="Bodega Central", ubicacion="Av. Industria 456, CDMX", capacidad_max=5000, productos_actuales=1200, encargado="Daniel Rangel"),
        Bodega(nombre="Bodega Norte", ubicacion="Calle Logística 78, Monterrey", capacidad_max=3000, productos_actuales=850, encargado="Ana López"),
        Bodega(nombre="Bodega Sur", ubicacion="Blvd. Almacén 22, Guadalajara", capacidad_max=2000, productos_actuales=420, encargado="Carlos Méndez"),
    ]
    for b in bodegas:
        db.add(b)
    db.commit()
    print("✅ Bodegas insertadas.")
except Exception as e:
    db.rollback()
    print("❌ Error:", e)
finally:
    db.close()