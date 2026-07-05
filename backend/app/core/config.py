from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LifeLaw"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/legal_impact_ai"
    congress_api_key: str | None = None
    govinfo_api_key: str | None = None
    courtlistener_api_key: str | None = None
    legiscan_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
