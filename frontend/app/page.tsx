import Link from "next/link";
import { PlaneTakeoff, Map, Calendar, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center max-w-3xl space-y-8">
        <div className="flex justify-center mb-6">
          <PlaneTakeoff className="h-24 w-24 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
          Smart Travel <span className="text-indigo-600 dark:text-indigo-400">Planner</span>
        </h1>
        <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
          Build your perfect itinerary in minutes. Tell us where you want to go, what you want to see, and let our rule-based engine do the rest.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/create-trip"
            className="rounded-md bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:scale-105"
          >
            Start Planning
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Map className="h-8 w-8 text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Discover Places</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Find top-rated attractions in your destination.</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Calendar className="h-8 w-8 text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Set Priorities</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Mark your must-visits and skip the rest.</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Clock className="h-8 w-8 text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Save Time</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Get an optimized day-by-day schedule.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
