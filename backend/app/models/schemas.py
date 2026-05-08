from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from .domain import PriorityEnum

# Attraction schemas
class AttractionBase(BaseModel):
    place_id: str
    destination: str
    name: str
    description: str
    rating: float
    estimated_duration_mins: int
    lat: Optional[float] = None
    lng: Optional[float] = None

class AttractionCreate(AttractionBase):
    pass

class Attraction(AttractionBase):
    id: int
    class Config:
        from_attributes = True

# Trip schemas
class TripBase(BaseModel):
    destination: str
    num_days: int
    start_date: date
    daily_travel_hours: float

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Preference schemas
class PreferenceCreate(BaseModel):
    attraction_id: int
    priority: PriorityEnum

class PreferenceUpdateList(BaseModel):
    preferences: List[PreferenceCreate]

# Itinerary schema
class ItineraryItemBase(BaseModel):
    day_number: int
    visit_order: int
    start_time: str
    end_time: str
    travel_time_mins: int

class ItineraryItem(ItineraryItemBase):
    id: int
    trip_id: int
    attraction: Attraction
    class Config:
        from_attributes = True
