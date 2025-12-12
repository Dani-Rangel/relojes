from .base import Base
from .cliente import Cliente
from .empleado import Empleado
from .proveedor import Proveedor
from .producto import Producto
from .pedido import Pedido
from .bodega import Bodega  # ✅ Añadido
from .factura import Factura  # ✅ Añadido

__all__ = ["Base"]