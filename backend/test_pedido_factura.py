# backend/test_pedido_factura.py
from app.models.base import SessionLocal
from app.models.cliente import Cliente
from app.models.empleado import Empleado
from app.models.pedido import Pedido, EstadoPedidoEnum
from app.models.factura import Factura, MetodoPagoEnum, EstadoFacturaEnum
from datetime import datetime

db = SessionLocal()

try:
    # Obtener cliente y empleado de prueba
    cliente = db.query(Cliente).filter(Cliente.email == "carlos@example.com").first()
    empleado = db.query(Empleado).filter(Empleado.email == "admin@relojes.com").first()
    
    if cliente and empleado:
        # Crear pedido de prueba
        pedido = Pedido(
            id_cliente=cliente.id,
            id_empleado=empleado.id,
            total=14599.95,
            estado=EstadoPedidoEnum.ENTREGADO
        )
        db.add(pedido)
        db.flush()  # Obtener ID del pedido

        # Crear factura para el pedido
        factura = Factura(
            id_cliente=cliente.id,
            id_empleado=empleado.id,
            id_pedido=pedido.id,
            subtotal=12586.16,
            impuestos=2013.79,
            total=14599.95,
            metodo_pago=MetodoPagoEnum.TARJETA,
            estado=EstadoFacturaEnum.PAGADA,
            serie="FAC-2025",
            folio=1001,
            fecha_emision=datetime.now(),
            fecha_pago=datetime.now()
        )
        db.add(factura)
        
        db.commit()
        print("✅ Pedido y factura de prueba creados")
        print(f"   Pedido ID: {pedido.id}")
        print(f"   Factura: FAC-2025-1001")

except Exception as e:
    db.rollback()
    print("❌ Error:", e)
finally:
    db.close()