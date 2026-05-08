from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import domain, schemas
from app.services import google_api, planner

router = APIRouter()

@router.post("/trips", response_model=schemas.Trip)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    # Create dummy user if not exists
    user = db.query(domain.User).first()
    if not user:
        user = domain.User(name="Guest", email="guest@example.com")
        db.add(user)
        db.commit()
        db.refresh(user)

    db_trip = domain.Trip(**trip.model_dump(), user_id=user.id)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.get("/trips/{trip_id}/attractions", response_model=List[schemas.Attraction])
def get_attractions(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(domain.Trip).filter(domain.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Check if we already have attractions for this destination
    db_attractions = db.query(domain.Attraction).filter(domain.Attraction.destination == trip.destination).all()
    
    if not db_attractions:
        # Fetch from mock/API and save to DB
        fetched_data = google_api.fetch_attractions(trip.destination)
        for data in fetched_data:
            attr = domain.Attraction(**data, destination=trip.destination)
            db.add(attr)
        db.commit()
        db_attractions = db.query(domain.Attraction).filter(domain.Attraction.destination == trip.destination).all()
        
    return db_attractions

@router.post("/trips/{trip_id}/preferences")
def save_preferences(trip_id: int, prefs: schemas.PreferenceUpdateList, db: Session = Depends(get_db)):
    trip = db.query(domain.Trip).filter(domain.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    # Delete existing preferences for this trip
    db.query(domain.UserPreference).filter(domain.UserPreference.trip_id == trip_id).delete()
    
    for p in prefs.preferences:
        db_pref = domain.UserPreference(
            trip_id=trip_id,
            attraction_id=p.attraction_id,
            priority=p.priority
        )
        db.add(db_pref)
    db.commit()
    return {"status": "success"}

@router.post("/trips/{trip_id}/generate")
def generate_itinerary(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(domain.Trip).filter(domain.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    # Delete existing itinerary
    db.query(domain.ItineraryItem).filter(domain.ItineraryItem.trip_id == trip_id).delete()
    
    # Generate new
    items = planner.generate_itinerary(db, trip)
    for item in items:
        db.add(item)
    db.commit()
    return {"status": "success", "count": len(items)}

@router.get("/trips/{trip_id}/itinerary", response_model=List[schemas.ItineraryItem])
def get_itinerary(trip_id: int, db: Session = Depends(get_db)):
    items = db.query(domain.ItineraryItem).filter(domain.ItineraryItem.trip_id == trip_id).order_by(domain.ItineraryItem.day_number, domain.ItineraryItem.visit_order).all()
    return items
