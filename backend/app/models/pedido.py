from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Float, func, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class EstadoPedidoEnum(enum.Enum):
    PENDIENTE = "pendiente"
    CONFIRMADO = "confirmado"
    EN_PREPARACION = "en_preparacion"
    ENVIADO = "enviado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"
    DEVUELTO = "devuelto"

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    id_empleado = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    fecha_pedido = Column(DateTime, default=func.now(), nullable=False)
    estado = Column(Enum(EstadoPedidoEnum), nullable=False, default=EstadoPedidoEnum.PENDIENTE)
    total = Column(Float, nullable=False, default=0.0)

    cliente = relationship("Cliente", back_populates="pedidos")
    empleado = relationship("Empleado", back_populates="pedidos")