from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from .config import settings

class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 declarative base class.
    """
    pass

# Create the asynchronous engine for PostgreSQL/PostGIS
engine = create_async_engine(
    settings.async_database_url,
    echo=settings.ENVIRONMENT == "development",
)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def init_db() -> None:
    """
    Initializes the database by enabling the PostGIS extension
    and creating all tables registered on the Base metadata.
    """
    async with engine.begin() as conn:
        # Enable the PostGIS extension in the database
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        
        # Import models here to ensure they are registered on the Base metadata
        from .models.spatial import Facility, TelemetryLog
        
        # Create all tables asynchronously using run_sync
        await conn.run_sync(Base.metadata.create_all)
