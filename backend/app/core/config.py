from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Travel Itinerary Planner"
    DATABASE_URL: str = "postgresql://user:password@db:5432/travel_planner"
    GOOGLE_MAPS_API_KEY: str | None = None
    USE_MOCK_DATA: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
