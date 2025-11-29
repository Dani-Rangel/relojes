from app.models.base import SessionLocal
from app.models.cliente import Cliente
from app.models.empleado import Empleado, CargoEnum
from app.services.auth_service import get_password_hash
from datetime import date

db = SessionLocal()

try:
    admin = Empleado(
        nombre="Daniel",
        apellido="Rangel",
        cargo=CargoEnum.ADMINISTRADOR,
        salario=15000.00,
        fecha_ingreso=date(2025, 1, 15),
        activo=True,
        email="admin@relojes.com",
        password_hash=get_password_hash("admin123")
    )
    db.add(admin)

    cliente = Cliente(
        nombre="Carlos",
        apellido="Méndez",
        email="carlos@example.com",
        telefono="555-9876",
        direccion="Av. Siempre Viva 123",
        fecha_registro=date.today(),
        activo=True,
        password_hash=get_password_hash("cliente123")
    )
    db.add(cliente)

    db.commit()
    print("✅ Usuarios de prueba creados:")
    print("- Empleado: admin@relojes.com / admin123")
    print("- Cliente: carlos@example.com / cliente123")

except Exception as e:
    db.rollback()
    print("❌ Error:", e)
finally:
    db.close()