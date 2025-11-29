from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True)
    telefono = Column(String(20))
    direccion = Column(String(200))
    fecha_registro = Column(Date)
    activo = Column(Boolean, default=True)
    password_hash = Column(String(128))

    pedidos = relationship("Pedido", back_populates="cliente")