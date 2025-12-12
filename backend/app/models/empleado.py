from sqlalchemy import Column, Integer, String, Date, Float, Boolean, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class CargoEnum(enum.Enum):
    VENDEDOR = "vendedor"
    ALMACENISTA = "almacenista" 
    GERENTE = "gerente"
    ADMINISTRADOR = "administrador"

class EstadoEmpleadoEnum(enum.Enum):
    PENDIENTE = "pendiente"      # ✅ Nuevo: para aprobación
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
    INACTIVO = "inactivo"

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
    
    # ✅ Nuevo: estado de aprobación
    estado = Column(Enum(EstadoEmpleadoEnum), default=EstadoEmpleadoEnum.PENDIENTE)

    pedidos = relationship("Pedido", back_populates="empleado")
    facturas = relationship("Factura", back_populates="empleado")