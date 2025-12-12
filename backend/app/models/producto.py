from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    marca = Column(String(50))
    modelo_reloj = Column(String(50))
    material_caja = Column(String(30))
    material_correa = Column(String(30))
    precio = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    id_proveedor = Column(Integer, ForeignKey("proveedores.id"))
    imagen_url = Column(String(255), nullable=True)

    proveedor = relationship("Proveedor", back_populates="productos")