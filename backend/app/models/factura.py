from sqlalchemy import Column, Integer, Integer, ForeignKey, DateTime, Float, String, Text, func, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class MetodoPagoEnum(enum.Enum):
    EFECTIVO = "efectivo"
    TARJETA = "tarjeta"
    TRANSFERENCIA = "transferencia"
    PAYPAL = "paypal"
    CRIPTOMONEDA = "criptomoneda"

class EstadoFacturaEnum(enum.Enum):
    EMITIDA = "emitida"
    PAGADA = "pagada"
    CANCELADA = "cancelada"
    DEVUELTA = "devuelta"

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    id_empleado = Column(Integer, ForeignKey("empleados.id"), nullable=False)  # Quién emite la factura
    id_pedido = Column(Integer, ForeignKey("pedidos.id"), nullable=True)  # Opcional: vinculado a un pedido
    fecha_emision = Column(DateTime, default=func.now(), nullable=False)
    fecha_pago = Column(DateTime, nullable=True)
    subtotal = Column(Float, nullable=False)
    impuestos = Column(Float, default=0.0)  # Ej: IVA 16%
    total = Column(Float, nullable=False)
    metodo_pago = Column(Enum(MetodoPagoEnum), nullable=False)
    estado = Column(Enum(EstadoFacturaEnum), default=EstadoFacturaEnum.EMITIDA, nullable=False)
    serie = Column(String(20), unique=True, index=True)  # Ej: "FAC-2025-0001"
    folio = Column(Integer, nullable=False)  # Incremental por serie
    notas = Column(Text)  # Observaciones adicionales

    # Relaciones
    cliente = relationship("Cliente", back_populates="facturas")
    empleado = relationship("Empleado", back_populates="facturas")
    pedido = relationship("Pedido", back_populates="factura")