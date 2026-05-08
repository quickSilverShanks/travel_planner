from typing import List
from sqlalchemy.orm import Session
from app.models import domain
from app.services import google_api

def generate_itinerary(db: Session, trip: domain.Trip):
    # 1. Fetch preferences for this trip
    preferences = db.query(domain.UserPreference).filter(domain.UserPreference.trip_id == trip.id).all()
    
    # 2. Map preferences to attractions
    attraction_ids = [p.attraction_id for p in preferences if p.priority != domain.PriorityEnum.SKIP]
    attractions = db.query(domain.Attraction).filter(domain.Attraction.id.in_(attraction_ids)).all()
    
    attraction_map = {a.id: a for a in attractions}
    pref_map = {p.attraction_id: p for p in preferences}
    
    # 3. Categorize
    must_visit = []
    high = []
    medium = []
    low = []
    
    for a in attractions:
        p = pref_map.get(a.id)
        if not p:
            continue
        if p.priority == domain.PriorityEnum.MUST_VISIT:
            must_visit.append(a)
        elif p.priority == domain.PriorityEnum.HIGH:
            high.append(a)
        elif p.priority == domain.PriorityEnum.MEDIUM:
            medium.append(a)
        elif p.priority == domain.PriorityEnum.LOW:
            low.append(a)
            
    # Combine priority queues
    all_to_visit = must_visit + high + medium + low
    
    # 4. Plan days
    itinerary_items = []
    current_day = 1
    current_time_mins = 9 * 60 # Start at 9:00 AM
    daily_limit_mins = int(trip.daily_travel_hours * 60)
    time_spent_today = 0
    visit_order = 1
    
    last_location = None
    
    for attraction in all_to_visit:
        if current_day > trip.num_days:
            break # Ran out of days
            
        # Estimate travel time
        travel_time = 0
        if last_location:
            travel_time = google_api.estimate_travel_time(
                last_location.lat, last_location.lng,
                attraction.lat, attraction.lng
            )
        else:
            travel_time = 0 # first place of the day
            
        visit_duration = attraction.estimated_duration_mins
        total_time_needed = travel_time + visit_duration
        
        # Check if it fits in current day
        if time_spent_today + total_time_needed > daily_limit_mins:
            # Move to next day
            current_day += 1
            if current_day > trip.num_days:
                # If it's a MUST_VISIT, we probably should have tried harder to fit it.
                # For simplicity, we just stop if out of days.
                break
            current_time_mins = 9 * 60
            time_spent_today = 0
            visit_order = 1
            last_location = None
            travel_time = 0 # reset travel time for first place of new day
            total_time_needed = travel_time + visit_duration

        # Calculate times
        start_hour = current_time_mins // 60
        start_minute = current_time_mins % 60
        start_time_str = f"{start_hour:02d}:{start_minute:02d}"
        
        current_time_mins += total_time_needed
        time_spent_today += total_time_needed
        
        end_hour = current_time_mins // 60
        end_minute = current_time_mins % 60
        end_time_str = f"{end_hour:02d}:{end_minute:02d}"
        
        # Create item
        item = domain.ItineraryItem(
            trip_id=trip.id,
            day_number=current_day,
            attraction_id=attraction.id,
            visit_order=visit_order,
            start_time=start_time_str,
            end_time=end_time_str,
            travel_time_mins=travel_time
        )
        itinerary_items.append(item)
        
        last_location = attraction
        visit_order += 1
        
    return itinerary_items
