"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, ArrowLeft } from "lucide-react";

type ItineraryItem = {
  id: number;
  day_number: number;
  visit_order: number;
  start_time: string;
  end_time: string;
  travel_time_mins: number;
  attraction: {
    name: string;
    description: string;
    rating: number;
  };
};

export default function Itinerary({ params }: { params: { id: string } }) {
  const tripId = params.id;
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/trips/${tripId}/itinerary`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [tripId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading itinerary...</div>;
  }

  // Group by day
  const days = items.reduce((acc, item) => {
    if (!acc[item.day_number]) {
      acc[item.day_number] = [];
    }
    acc[item.day_number].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Optimized Itinerary</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Here is your day-by-day plan based on your priorities.</p>
          </div>
        </div>

        {Object.keys(days).length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">No items could be scheduled. You may have marked everything as skip, or not enough time was provided.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(days).map(([dayNumber, dayItems]) => (
              <div key={dayNumber} className="relative">
                <div className="sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur pb-4 z-10">
                  <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900 pb-2 inline-block">
                    Day {dayNumber}
                  </h2>
                </div>
                
                <div className="mt-6 space-y-6">
                  {dayItems.map((item, index) => (
                    <div key={item.id} className="relative pl-8 sm:pl-32 py-2 group">
                      
                      {/* Timeline line */}
                      <div className="absolute left-4 sm:left-[108px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-last:bottom-auto group-last:h-full"></div>
                      
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 sm:left-[103px] top-6 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-slate-50 dark:border-slate-900 z-10"></div>

                      {/* Time (desktop) */}
                      <div className="hidden sm:block absolute left-0 top-5 w-20 text-right">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white block">{item.start_time}</span>
                        <span className="text-xs text-slate-500 block">{item.end_time}</span>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
                        
                        {/* Time (mobile) */}
                        <div className="sm:hidden mb-2 inline-flex items-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-semibold">
                          {item.start_time} - {item.end_time}
                        </div>

                        {item.travel_time_mins > 0 && index !== 0 && (
                          <div className="mb-4 inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-1 rounded-md">
                            <Navigation className="w-3 h-3 mr-1" />
                            ~{item.travel_time_mins} mins travel from previous
                          </div>
                        )}

                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <MapPin className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" />
                            {item.attraction.name}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {item.attraction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
