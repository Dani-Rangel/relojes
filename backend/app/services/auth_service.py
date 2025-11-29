import bcrypt
from sqlalchemy.orm import Session
from ..models.cliente import Cliente
from ..models.empleado import Empleado

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except:
        return False

def authenticate_user(db: Session, email: str, password: str):
    if not email or not password:
        return None

    empleado = db.query(Empleado).filter(
        Empleado.email.ilike(email),
        Empleado.activo == True
    ).first()
    
    if empleado and verify_password(password, empleado.password_hash):
        return {
            "id": empleado.id,
            "nombre": f"{empleado.nombre} {empleado.apellido}",
            "email": empleado.email,
            "role": "empleado",
            "cargo": empleado.cargo.value
        }

    cliente = db.query(Cliente).filter(
        Cliente.email.ilike(email),
        Cliente.activo == True
    ).first()
    
    if cliente and cliente.password_hash and verify_password(password, cliente.password_hash):
        return {
            "id": cliente.id,
            "nombre": f"{cliente.nombre} {cliente.apellido}",
            "email": cliente.email,
            "role": "cliente"
        }

    return None
