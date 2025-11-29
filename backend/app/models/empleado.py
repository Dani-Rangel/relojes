from sqlalchemy import Column, Integer, String, Date, Float, Boolean, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class CargoEnum(enum.Enum):
    VENDEDOR = "vendedor"
    TECNICO = "tecnico"
    GERENTE = "gerente"
    ADMINISTRADOR = "administrador"
    ALMACENISTA = "almacenista"

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    cargo = Column(Enum(CargoEnum), nullable=False)
    salario = Column(Float)
    fecha_ingreso = Column(Date)
    activo = Column(Boolean, default=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(128), nullable=False)

    pedidos = relationship("Pedido", back_populates="empleado")