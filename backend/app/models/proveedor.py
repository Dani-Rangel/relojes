from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from .base import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre_empresa = Column(String(100), nullable=False)
    contacto = Column(String(100))
    email = Column(String(100), unique=True)
    telefono = Column(String(20))
    direccion = Column(Text)
    sitio_web = Column(String(100))

    productos = relationship("Producto", back_populates="proveedor")