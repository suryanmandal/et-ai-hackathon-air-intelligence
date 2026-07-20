import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, BigInteger, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from ..database import Base

class Facility(Base):
    """
    Facility model representing industrial stacks, construction sites, etc.
    with exact spatial coordinates using PostGIS Geometry(POINT).
    """
    __tablename__ = "facilities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid()
    )
    facility_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    compliance_status: Mapped[str] = mapped_column(String, default="ACTIVE", server_default="ACTIVE")
    geom: Mapped[Geometry] = mapped_column(Geometry("POINT", srid=4326))


class TelemetryLog(Base):
    """
    TelemetryLog model representing environmental data linked to H3 hexagons.
    """
    __tablename__ = "telemetry_logs"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    h3_index: Mapped[str] = mapped_column(String(15), index=True)
    aqi_value: Mapped[int] = mapped_column(Integer)
    pm25: Mapped[float] = mapped_column(Float)
    pm10: Mapped[float] = mapped_column(Float)
    no2: Mapped[float] = mapped_column(Float)
    so2: Mapped[float] = mapped_column(Float)
    co: Mapped[float] = mapped_column(Float)
    traffic_density_scalar: Mapped[float] = mapped_column(Float, default=1.0, server_default="1.0")
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now()
    )
