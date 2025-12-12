from app.models.base import SessionLocal
from app.models.proveedor import Proveedor
from app.models.producto import Producto
from datetime import date

db = SessionLocal()

try:
    # 🔹 PROVEEDORES
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

    # 🔹 PRODUCTOS CON IMÁGENES REALES
    relojes_data = [
        # Rolex
        {
            "nombre": "Rolex Submariner Date",
            "descripcion": "Icónico reloj de buceo automático.",
            "marca": "Rolex",
            "modelo_reloj": "126610LN",
            "material_caja": "Acero Oystersteel",
            "material_correa": "Acero Oyster",
            "precio": 14500.00,
            "stock": 8,
            "imagen_url": "https://content.rolex.com/dam/2020/upright-bba-with-shadow/m126610ln-0001.png",
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        {
            "nombre": "Rolex Daytona",
            "descripcion": "Cronógrafo deportivo de alta precisión.",
            "marca": "Rolex",
            "modelo_reloj": "116500LN",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 29800.00,
            "stock": 3,
            "imagen_url": "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m116500ln-0001.png",
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Omega
        {
            "nombre": "Omega Speedmaster Moonwatch",
            "descripcion": "Primer reloj usado en la luna.",
            "marca": "Omega",
            "modelo_reloj": "310.30.42.50.01.001",
            "material_caja": "Acero Inoxidable",
            "material_correa": "Acero",
            "precio": 7250.00,
            "stock": 12,
            "imagen_url": "https://www.omegawatches.com/media/catalog/product/o/m/omega-speedmaster-moonwatch-31030425001002-l.png",
            "id_proveedor": proveedores["European Horology Group"]
        },
        {
            "nombre": "Omega Seamaster Diver 300M",
            "descripcion": "Reloj de buceo profesional.",
            "marca": "Omega",
            "modelo_reloj": "210.30.42.20.03.001",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 5800.00,
            "stock": 15,
            "imagen_url": "https://www.omegawatches.com/media/catalog/product/s/e/seamaster-21030422003001-l.png",
            "id_proveedor": proveedores["European Horology Group"]
        },
        # TAG Heuer
        {
            "nombre": "TAG Heuer Carrera Chronograph",
            "descripcion": "Cronógrafo deportivo.",
            "marca": "TAG Heuer",
            "modelo_reloj": "CBN2A1A.BA0643",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 6550.00,
            "stock": 7,
            "imagen_url": "https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dwc5ffe7f7/images/hi-res/CBN2A1B.BA0643.png",
            "id_proveedor": proveedores["Swiss Time Imports"]
        },
        # Seiko
        {
            "nombre": "Seiko Presage Cocktail Time",
            "descripcion": "Diseño inspirado en cócteles.",
            "marca": "Seiko",
            "modelo_reloj": "SRPJ47",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 425.00,
            "stock": 25,
            "imagen_url": "https://www.seikowatches.com/global-en/products/presage/n_prezage_srpb41j1_2000x2000.png",
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        {
            "nombre": "Seiko Prospex Diver",
            "descripcion": "Reloj de buceo ISO 6425.",
            "marca": "Seiko",
            "modelo_reloj": "SRPE93",
            "material_caja": "Acero",
            "material_correa": "Silicona",
            "precio": 525.00,
            "stock": 18,
            "imagen_url": "https://www.seikowatches.com/global-en/products/prospex/n_SBDN067_2000x2000.png",
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # Casio
        {
            "nombre": "Casio G-Shock DW-5600",
            "descripcion": "Clásico G-Shock resistente.",
            "marca": "Casio",
            "modelo_reloj": "DW-5600E-1V",
            "material_caja": "Resina",
            "material_correa": "Resina",
            "precio": 99.95,
            "stock": 50,
            "imagen_url": "https://productimages.g-shock.com/dw5600ehr-1_hero.png",
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        {
            "nombre": "Casio Edifice EQB-1100",
            "descripcion": "Carga solar y Bluetooth.",
            "marca": "Casio",
            "modelo_reloj": "EQB-1100D-1A",
            "material_caja": "Acero",
            "material_correa": "Acero",
            "precio": 349.00,
            "stock": 22,
            "imagen_url": "https://productimages.edifice.casio.com/eqb1100xd.png",
            "id_proveedor": proveedores["Oriental Time Co."]
        },
        # ... (si quieres sigo con los otros 10 relojes)
    ]

    for data in relojes_data:
        producto = Producto(**data)
        db.add(producto)

    db.commit()
    print("✅ Proveedores y relojes con imágenes insertados.")

except Exception as e:
    db.rollback()
    print("❌ Error:", e)
finally:
    db.close()
