import httpx
from typing import List, Dict, Any
from app.core.config import settings

MOCK_ATTRACTIONS = {
    "paris": [
        {"place_id": "p1", "name": "Eiffel Tower", "description": "Iconic iron lattice tower", "rating": 4.8, "estimated_duration_mins": 120, "lat": 48.8584, "lng": 2.2945},
        {"place_id": "p2", "name": "Louvre Museum", "description": "World's largest art museum", "rating": 4.9, "estimated_duration_mins": 180, "lat": 48.8606, "lng": 2.3376},
        {"place_id": "p3", "name": "Notre-Dame de Paris", "description": "Medieval Catholic cathedral", "rating": 4.7, "estimated_duration_mins": 60, "lat": 48.8529, "lng": 2.3499},
        {"place_id": "p4", "name": "Arc de Triomphe", "description": "Famous monumental arch", "rating": 4.7, "estimated_duration_mins": 60, "lat": 48.8738, "lng": 2.2950},
        {"place_id": "p5", "name": "Sacré-Cœur", "description": "Basilica on Montmartre hill", "rating": 4.7, "estimated_duration_mins": 90, "lat": 48.8867, "lng": 2.3431},
        {"place_id": "p6", "name": "Musée d'Orsay", "description": "Museum with Impressionist masterpieces", "rating": 4.8, "estimated_duration_mins": 150, "lat": 48.8600, "lng": 2.3226},
        {"place_id": "p7", "name": "Luxembourg Gardens", "description": "Beautiful 17th-century park", "rating": 4.8, "estimated_duration_mins": 90, "lat": 48.8462, "lng": 2.3371},
        {"place_id": "p8", "name": "Panthéon", "description": "Mausoleum containing remains of distinguished French citizens", "rating": 4.6, "estimated_duration_mins": 60, "lat": 48.8462, "lng": 2.3449},
    ],
    "tokyo": [
        {"place_id": "t1", "name": "Senso-ji", "description": "Ancient Buddhist temple", "rating": 4.7, "estimated_duration_mins": 90, "lat": 35.7148, "lng": 139.7967},
        {"place_id": "t2", "name": "Tokyo Skytree", "description": "Tallest structure in Japan", "rating": 4.6, "estimated_duration_mins": 120, "lat": 35.7100, "lng": 139.8107},
        {"place_id": "t3", "name": "Meiji Jingu", "description": "Shinto shrine dedicated to Emperor Meiji", "rating": 4.8, "estimated_duration_mins": 90, "lat": 35.6764, "lng": 139.6993},
        {"place_id": "t4", "name": "Shibuya Crossing", "description": "Famous busy intersection", "rating": 4.6, "estimated_duration_mins": 30, "lat": 35.6595, "lng": 139.7005},
        {"place_id": "t5", "name": "Tokyo National Museum", "description": "Oldest Japanese national museum", "rating": 4.7, "estimated_duration_mins": 150, "lat": 35.7188, "lng": 139.7765},
    ]
}

def fetch_attractions(destination: str) -> List[Dict[str, Any]]:
    """
    Fetch attractions from Google Places API or mock data.
    """
    if settings.USE_MOCK_DATA or not settings.GOOGLE_MAPS_API_KEY:
        key = destination.lower()
        if key in MOCK_ATTRACTIONS:
            return MOCK_ATTRACTIONS[key]
        # Return a generic set if destination is not in mock data
        return MOCK_ATTRACTIONS["paris"]
    
    # Real implementation would go here
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(...)
    return []

def estimate_travel_time(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> int:
    """
    Estimate travel time using Distance Matrix API or mock.
    Returns time in minutes.
    """
    if settings.USE_MOCK_DATA or not settings.GOOGLE_MAPS_API_KEY:
        # Mock calculation: very rough estimation based on coordinates
        # 1 degree lat is ~111km. We'll just assign a mock time based on distance.
        dist = ((origin_lat - dest_lat)**2 + (origin_lng - dest_lng)**2)**0.5
        # completely arbitrary scaling for mock:
        mins = max(10, int(dist * 1000)) 
        return mins
    
    return 15 # default fallback
