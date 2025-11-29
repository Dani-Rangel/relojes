# backend/seed_productos.py
from app.models.base import SessionLocal
from app.models.proveedor import Proveedor
from app.models.producto import Producto
from datetime import date

db = SessionLocal()

try:
    # 🔹 Paso 1: Insertar proveedores (5 reales)
    proveedores_data = [
        {
            "nombre_empresa": "Swiss Time Imports",
            "contacto": "Carlos Méndez",
            "email": "contacto@swisstime.com",
            "telefono": "+52 55 1234 5678",
            "direccion": "Av. Relojeros 123, Ciudad de México",
            "sitio_web": "https://swisstime.mx"
        },
        {
            "nombre_empresa": "Luxury Watch Distributors",
            "contacto": "Ana Rodríguez",
            "email": "ventas@luxurywatch.com",
            "telefono": "+1 305 987 6543",
            "direccion": "123 Luxury Ave, Miami, FL",
            "sitio_web": "https://luxurywatch.com"
        },
        {
            "nombre_empresa": "Oriental Time Co.",
            "contacto": "Takashi Yamamoto",
            "email": "info@orientaltime.jp",
            "telefono": "+81 3 1234 5678",
            "direccion": "Ginza 4-5-6, Chuo, Tokyo",
            "sitio_web": "https://orientaltime.jp"
        },
        {
            "nombre_empresa": "European Horology Group",
            "contacto": "Hans Müller",
            "email": "sales@eurohorology.de",
            "telefono": "+49 30 9876 5432",
            "direccion": "Uhrenstraße 10, Berlin",
            "sitio_web": "https://eurohorology.de"
        },
        {
            "nombre_empresa": "American Precision Watches",
            "contacto": "John Smith",
            "email": "support@amprecision.com",
            "telefono": "+1 212 555 0199",
            "direccion": "5th Ave 789, New York, NY",
            "sitio_web": "https://amprecision.com"
        }
    ]

    proveedores = {}
    for data in proveedores_data:
        proveedor = Proveedor(**data)
        db.add(proveedor)
        db.flush()
        proveedores[data["nombre_empresa"]] = proveedor.id

    # 🔹 Paso 2: Insertar 20 relojes reales
    relojes_data = [
        # Rolex
        {
            "nombre": "Rolex Submariner Date",
            "descripcion": "El icónico reloj de buceo automático con fecha, resistente al agua hasta 300m.",
            "marca": "Rolex",
            "modelo_reloj": "126610LN",
            "material_caja": "Acero Oystersteel",
            "material_correa": "Acero Oyster",
            "precio": 14500.00,
            "stock": 8,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        {
            "nombre": "Rolex Daytona",
            "descripcion": "Cronógrafo deportivo de alta precisión, fabricado en acero y cerámica.",
            "marca": "Rolex",
            "modelo_reloj": "116500LN",
            "material_caja": "Acero Oystersteel",
            "material_correa": "Acero Oyster",
            "precio": 29800.00,
            "stock": 3,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Omega
        {
            "nombre": "Omega Speedmaster Moonwatch",
            "descripcion": "El primer reloj en la luna, cronógrafo manual con movimiento calibre 3861.",
            "marca": "Omega",
            "modelo_reloj": "310.30.42.50.01.001",
            "material_caja": "Acero Inoxidable",
            "material_correa": "Acero",
            "precio": 7250.00,
            "stock": 12,
            "id_proveedor": proveedores["European Horology Group"]
        },
        {
            "nombre": "Omega Seamaster Diver 300M",
            "descripcion": "Reloj de buceo con esfera de cerámica azul y bisel de cerámica.",
            "marca": "Omega",
            "modelo_reloj": "210.30.42.20.03.001",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 5800.00,
            "stock": 15,
            "id_proveedor": proveedores["European Horology Group"]
        },
        # TAG Heuer
        {
            "nombre": "TAG Heuer Carrera Chronograph",
            "descripcion": "Cronógrafo deportivo inspirado en las carreras, con movimiento automático.",
            "marca": "TAG Heuer",
            "modelo_reloj": "CBN2A1A.BA0643",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 6550.00,
            "stock": 7,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Seiko
        {
            "nombre": "Seiko Presage Cocktail Time",
            "descripcion": "Reloj automático japonés con esfera inspirada en cócteles y movimiento 4R35.",
            "marca": "Seiko",
            "modelo_reloj": "SRPJ47",
            "material_caja": "Acero Inoxidable",
            "material_correa": "Acero",
            "precio": 425.00,
            "stock": 25,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        {
            "nombre": "Seiko Prospex Diver",
            "descripcion": "Reloj de buceo ISO 6425, resistente a 200m, con movimiento automático.",
            "marca": "Seiko",
            "modelo_reloj": "SRPE93",
            "material_caja": "Acero",
            "material_correa": "Silicona",
            "precio": 525.00,
            "stock": 18,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # Casio
        {
            "nombre": "Casio G-Shock DW-5600",
            "descripcion": "El clásico reloj resistente a impactos, con cronómetro y alarma.",
            "marca": "Casio",
            "modelo_reloj": "DW-5600E-1V",
            "material_caja": "Resina",
            "material_correa": "Resina",
            "precio": 99.95,
            "stock": 50,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        {
            "nombre": "Casio Edifice EQB-1100",
            "descripcion": "Reloj conectado con Bluetooth, carga solar y resistencia al agua.",
            "marca": "Casio",
            "modelo_reloj": "EQB-1100D-1A",
            "material_caja": "Acero Inoxidable",
            "material_correa": "Acero",
            "precio": 349.00,
            "stock": 22,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # Tissot
        {
            "nombre": "Tissot PRX Powermatic 80",
            "descripcion": "Reloj automático con reserva de marcha de 80 horas y diseño vintage.",
            "marca": "Tissot",
            "modelo_reloj": "T137.407.11.041.00",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 795.00,
            "stock": 14,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Citizen
        {
            "nombre": "Citizen Eco-Drive Promaster",
            "descripcion": "Reloj solar con resistencia a 200m y cronógrafo.",
            "marca": "Citizen",
            "modelo_reloj": "BN0151-28E",
            "material_caja": "Acero Inoxidable",
            "material_correa": "Acero",
            "precio": 325.00,
            "stock": 20,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # Hamilton
        {
            "nombre": "Hamilton Khaki Field Auto",
            "descripcion": "Reloj militar inspirado en los relojes del ejército suizo.",
            "marca": "Hamilton",
            "modelo_reloj": "H70455133",
            "material_caja": "Acero",
            "material_correa": "Cuero Marrón",
            "precio": 695.00,
            "stock": 9,
            "id_proveedor": proveedores["European Horology Group"]
        },
        # Longines
        {
            "nombre": "Longines Master Collection",
            "descripcion": "Reloj automático de lujo con fecha y reserva de marcha de 64h.",
            "marca": "Longines",
            "modelo_reloj": "L2.909.4.78.3",
            "material_caja": "Acero",
            "material_correa": "Cuero Negro",
            "precio": 2850.00,
            "stock": 6,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Breitling
        {
            "nombre": "Breitling Navitimer B01",
            "descripcion": "Cronógrafo de aviación con regla de cálculo en el bisel.",
            "marca": "Breitling",
            "modelo_reloj": "AB0127211B1A1",
            "material_caja": "Acero",
            "material_correa": "Cuero Negro",
            "precio": 8990.00,
            "stock": 4,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Tudor
        {
            "nombre": "Tudor Black Bay 58",
            "descripcion": "Reloj de buceo vintage con movimiento MT5402 y 70h de reserva.",
            "marca": "Tudor",
            "modelo_reloj": "M79030N-0001",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 4175.00,
            "stock": 5,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Grand Seiko
        {
            "nombre": "Grand Seiko Heritage",
            "descripcion": "Reloj japonés de alta gama con esfera 'Snowflake' y movimiento Spring Drive.",
            "marca": "Grand Seiko",
            "modelo_reloj": "SBGA211",
            "material_caja": "Titanio",
            "material_correa": "Acero",
            "precio": 6200.00,
            "stock": 2,
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # IWC
        {
            "nombre": "IWC Pilot's Watch Mark XX",
            "descripcion": "Reloj de piloto con movimiento automático y diseño inspirado en la WWII.",
            "marca": "IWC",
            "modelo_reloj": "IW328202",
            "material_caja": "Acero",
            "material_correa": "Cuero Marrón",
            "precio": 5450.00,
            "stock": 3,
            "id_proveedor": proveedores["European Horology Group"]
        },
        # Jaeger-LeCoultre
        {
            "nombre": "Jaeger-LeCoultre Reverso",
            "descripcion": "Icono Art Decó con caja reversible y movimiento manual.",
            "marca": "Jaeger-LeCoultre",
            "modelo_reloj": "Q3738420",
            "material_caja": "Acero",
            "material_correa": "Cuero Negro",
            "precio": 9200.00,
            "stock": 1,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Patek Philippe (edición especial)
        {
            "nombre": "Patek Philippe Nautilus",
            "descripcion": "Reloj deportivo de lujo con esfera azul y brazalete integrado.",
            "marca": "Patek Philippe",
            "modelo_reloj": "5711/1A-010",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 150000.00,
            "stock": 1,
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Audemars Piguet
        {
            "nombre": "Audemars Piguet Royal Oak",
            "descripcion": "Reloj icónico con bisel octogonal y movimiento automático.",
            "marca": "Audemars Piguet",
            "modelo_reloj": "15500ST.OO.1220ST.01",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 28900.00,
            "stock": 2,
            "id_proveedor": proveedores["Luxury Watch Distributors"]
        }
    ]

    for data in relojes_data:
        producto = Producto(**data)
        db.add(producto)

    db.commit()
    print("✅ Se insertaron 5 proveedores y 20 relojes exitosamente.")
    print("   Ejemplo: Rolex Submariner ($14,500), Casio G-Shock ($99.95)")

except Exception as e:
    db.rollback()
    print("❌ Error:", e)
finally:
    db.close()