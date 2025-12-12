from sqlalchemy import Column, Integer, String, Text, Integer, Enum, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Bodega(Base):
    __tablename__ = "bodegas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ubicacion = Column(String(200), nullable=False)  # Ej: "Av. Industria 456, CDMX"
    capacidad_max = Column(Integer, nullable=False)  # Máximo de unidades que puede almacenar
    productos_actuales = Column(Integer, default=0)  # Control simple de ocupación
    encargado = Column(String(100))  # Nombre del responsable (puede ser un empleado)
    
    # Relaciones (opcional, si quieres vincular con empleados)
    encargado_id = Column(Integer, ForeignKey("empleados.id"), nullable=True)
    encargado_rel = relationship("Empleado")