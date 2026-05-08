"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTrip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    num_days: 3,
    start_date: new Date().toISOString().split("T")[0],
    daily_travel_hours: 8.0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/trip/${data.id}/attractions`);
      }
    } catch (error) {
      console.error("Failed to create trip", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Let's Go</div>
          <h2 className="block mt-1 text-2xl leading-tight font-bold text-black dark:text-white">Create a New Trip</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 mb-6">Fill in the details below to start planning.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Destination</label>
              <input
                type="text"
                id="destination"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="e.g. Paris"
              />
            </div>

            <div>
              <label htmlFor="num_days" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Days</label>
              <input
                type="number"
                id="num_days"
                min="1"
                max="30"
                required
                value={formData.num_days}
                onChange={(e) => setFormData({ ...formData, num_days: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                id="start_date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="daily_travel_hours" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Daily Travel Hours</label>
              <input
                type="number"
                id="daily_travel_hours"
                step="0.5"
                min="1"
                max="16"
                required
                value={formData.daily_travel_hours}
                onChange={(e) => setFormData({ ...formData, daily_travel_hours: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-500">How many hours per day do you want to spend exploring?</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Continue to Attractions"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
