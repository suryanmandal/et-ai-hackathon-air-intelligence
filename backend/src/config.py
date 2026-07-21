from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # App General Settings
    PROJECT_NAME: str = "VayuSense API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database Configuration
    DATABASE_URL: str = Field(default="", validation_alias="DATABASE_URL")
    DB_HOST: str = Field(default="localhost", validation_alias="DB_HOST")
    DB_PORT: int = Field(default=5432, validation_alias="DB_PORT")
    DB_USER: str = Field(default="admin", validation_alias="DB_USER")
    DB_PASSWORD: str = Field(default="secret_hackathon_key", validation_alias="DB_PASSWORD")
    DB_NAME: str = Field(default="vayusense", validation_alias="DB_NAME")

    # Spatial Constants
    DEFAULT_CRS: int = 4326  # WGS 84 (GPS coordinates)
    PROJECTED_CRS: int = 3857  # Web Mercator
    
    # Model configuration for loading environments/dotenv files
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def database_url(self) -> str:
        """
        Get synchronous database URL for psycopg2/SQLAlchemy.
        """
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                return url.replace("postgres://", "postgresql://", 1)
            return url
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def async_database_url(self) -> str:
        """
        Get asynchronous database URL if asyncpg is used.
        """
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()
