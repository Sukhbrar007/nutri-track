/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DailySummary from "@/components/dashboard/DailySummary";
import NutritionStats from "@/components/dashboard/NutritionStats";
import CalendarView from "@/components/dashboard/CalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const estTimeZone = "America/New_York";

interface NutritionGoals {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

function CalendarPageContent() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
  });
  const [todaySummary, setTodaySummary] = useState<DailySummary>({
    date: new Date().toISOString().split("T")[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [dailyData, setDailyData] = useState<DailySummary[]>([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/summary");

        if (!response.ok) {
          throw new Error("Failed to fetch summary data");
        }

        const data = await response.json();

        setTodaySummary({
          ...data.todaySummary,
          date: format(
            toZonedTime(new Date(data.todaySummary.date), estTimeZone),
            "yyyy-MM-dd"
          ),
        });

        setDailyData(
          data.dailyData.map((day: any) => ({
            ...day,
            date: format(
              toZonedTime(new Date(day.date), estTimeZone),
              "yyyy-MM-dd"
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching summary:", error);
        setError("Could not load your nutrition data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSummaryData();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome back, {session.user.name || session.user.email}!
      </p>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 animate-pulse h-64 rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Summary Card */}
          <div>
            <DailySummary summary={todaySummary} goals={goals} />
          </div>

          {/* Calendar View */}
          <div>
            <CalendarView dayData={dailyData} />
          </div>

          {/* Quick Actions Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Record your meals to track your nutrition progress.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="bg-primary text-white p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </span>
                      <a
                        href={`/day/${new Date().toISOString().split("T")[0]}`}
                        className="text-primary hover:underline"
                      >
                        Log Today&apos;s Food
                      </a>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary text-white p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <a
                        href="/calendar"
                        className="text-primary hover:underline"
                      >
                        View Calendar
                      </a>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-primary text-white p-1 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </span>
                      <a
                        href="/settings"
                        className="text-primary hover:underline"
                      >
                        Update Nutrition Goals
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Nutrition Stats (spans 2 columns) */}
          <div className="lg:col-span-3 md:col-span-2">
            <NutritionStats data={dailyData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarPageContent />
    </Suspense>
  );
}
