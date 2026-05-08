from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class PriorityEnum(enum.Enum):
    MUST_VISIT = "must_visit"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    SKIP = "skip"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String, index=True)
    num_days = Column(Integer)
    start_date = Column(Date)
    daily_travel_hours = Column(Float)
    
    preferences = relationship("UserPreference", back_populates="trip", cascade="all, delete-orphan")
    itinerary_items = relationship("ItineraryItem", back_populates="trip", cascade="all, delete-orphan")

class Attraction(Base):
    __tablename__ = "attractions"
    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(String, unique=True, index=True)
    destination = Column(String, index=True)
    name = Column(String)
    description = Column(String)
    rating = Column(Float)
    estimated_duration_mins = Column(Integer)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    attraction_id = Column(Integer, ForeignKey("attractions.id"))
    priority = Column(Enum(PriorityEnum))

    trip = relationship("Trip", back_populates="preferences")
    attraction = relationship("Attraction")

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    day_number = Column(Integer)
    attraction_id = Column(Integer, ForeignKey("attractions.id"))
    visit_order = Column(Integer)
    start_time = Column(String) # For simplicity, e.g. "09:00"
    end_time = Column(String)
    travel_time_mins = Column(Integer, default=0) # time from previous location

    trip = relationship("Trip", back_populates="itinerary_items")
    attraction = relationship("Attraction")
