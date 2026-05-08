"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Clock } from "lucide-react";

type Attraction = {
  id: number;
  name: string;
  description: string;
  rating: number;
  estimated_duration_mins: number;
};

export default function AttractionsSelection({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tripId = params.id;
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [preferences, setPreferences] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/trips/${tripId}/attractions`)
      .then((res) => res.json())
      .then((data) => {
        setAttractions(data);
        const initPrefs: Record<number, string> = {};
        data.forEach((a: Attraction) => {
          initPrefs[a.id] = "medium"; // default priority
        });
        setPreferences(initPrefs);
        setLoading(false);
      })
      .catch(console.error);
  }, [tripId]);

  const handlePriorityChange = (id: number, priority: string) => {
    setPreferences((prev) => ({ ...prev, [id]: priority }));
  };

  const handleSaveAndGenerate = async () => {
    setSaving(true);
    try {
      // 1. Save preferences
      const prefPayload = {
        preferences: Object.entries(preferences).map(([attraction_id, priority]) => ({
          attraction_id: parseInt(attraction_id),
          priority,
        })),
      };
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      
      await fetch(`${apiUrl}/trips/${tripId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefPayload),
      });

      // 2. Generate itinerary
      await fetch(`${apiUrl}/trips/${tripId}/generate`, {
        method: "POST",
      });

      // 3. Redirect
      router.push(`/trip/${tripId}/itinerary`);
    } catch (error) {
      console.error("Failed to generate itinerary", error);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading attractions...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">What do you want to see?</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Set priorities for each attraction to help us build your perfect itinerary.</p>
          </div>
          <button
            onClick={handleSaveAndGenerate}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attr) => (
            <div key={attr.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">{attr.name}</h3>
                  <div className="flex items-center text-amber-500 text-sm font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {attr.rating}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{attr.description}</p>
                <div className="mt-4 flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {attr.estimated_duration_mins} mins
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                <select
                  value={preferences[attr.id]}
                  onChange={(e) => handlePriorityChange(attr.id, e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="must_visit">Must Visit (Highest)</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="skip">Skip</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
