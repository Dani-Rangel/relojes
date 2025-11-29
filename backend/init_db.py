from app.models import Base
from app.models.base import engine

if __name__ == "__main__":
    print("🔧 Creando tablas en MySQL...")
    Base.metadata.create_all(bind=engine)
    print("✅ ¡Tablas creadas exitosamente!")