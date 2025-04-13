/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import DailySummary from "@/components/dashboard/DailySummary";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Target,
  Calendar,
  BarChart2,
  Settings,
  Plus,
} from "lucide-react";
import CalendarView from "@/components/dashboard/CalendarView";
import NutritionStats from "@/components/dashboard/NutritionStats";

// Define interfaces
interface NutritionGoals {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

interface DailySummaryData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Main dashboard component
function DashboardContent() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<DailySummaryData>({
    date: format(new Date(), "yyyy-MM-dd"),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
  });
  const [dailyData, setDailyData] = useState<DailySummaryData[]>([]);

  useEffect(() => {
    if (!session) return;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data from the summary endpoint
        const summaryResponse = await fetch("/api/summary");

        if (!summaryResponse.ok) {
          throw new Error("Failed to fetch summary data");
        }

        const summaryData = await summaryResponse.json();
        console.log("API Response:", summaryData); // For debugging

        // Get the goals from the summary response
        if (summaryData.goals) {
          setGoals(summaryData.goals);
        }

        // Process today's data
        if (summaryData.todaySummary) {
          // Make sure we're getting a clean date string without time component
          const processedTodaySummary = {
            ...summaryData.todaySummary,
            date: summaryData.todaySummary.date.split("T")[0],
          };
          setTodayData(processedTodaySummary);
          console.log("Today's data updated:", processedTodaySummary); // For debugging
        } else {
          console.warn("No today's summary data found in API response");
        }

        // Process historical data
        if (summaryData.dailyData && Array.isArray(summaryData.dailyData)) {
          const processedDailyData = summaryData.dailyData.map(
            (day: { date: string }) => ({
              ...day,
              date: day.date.split("T")[0],
            })
          );
          setDailyData(processedDailyData);
        } else {
          console.warn(
            "No daily data found in API response or incorrect format"
          );
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load your nutrition data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [session]);

  // Current date
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  // Return early if no session
  if (!session) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with welcome */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {session.user.name || "User"}!
              </h1>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl shadow-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <CalendarView dayData={dailyData} nutritionGoals={goals} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Today's Summary */}
                {/* <DailySummary summary={todayData} goals={goals} /> */}
                <NutritionStats data={dailyData} nutritionGoals={goals} />

                {/* Quick Actions */}
                <Card className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-100 pb-3">
                    <CardTitle className="text-xl font-semibold">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`/day/${format(today, "yyyy-MM-dd")}`}
                        className="group bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-3 rounded-xl transition flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="bg-white rounded-lg p-2 shadow-sm mr-3">
                            <Plus className="h-5 w-5 text-blue-500" />
                          </div>
                          <span className="font-medium text-gray-800">
                            Log Today&apos;s Food
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                      </a>

                      <a
                        href="/calculator"
                        className="group bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 p-3 rounded-xl transition flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="bg-white rounded-lg p-2 shadow-sm mr-3">
                            <BarChart2 className="h-5 w-5 text-emerald-500" />
                          </div>
                          <span className="font-medium text-gray-800">
                            Calculator
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
                      </a>

                      <a
                        href="/settings"
                        className="group bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-3 rounded-xl transition flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="bg-white rounded-lg p-2 shadow-sm mr-3">
                            <Settings className="h-5 w-5 text-purple-500" />
                          </div>
                          <span className="font-medium text-gray-800">
                            Settings
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Nutrition Goals */}
                <Card className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-100 pb-3">
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-500" /> Your
                      Nutrition Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Daily Calories
                        </div>
                        <div className="text-xl font-bold text-blue-700">
                          {goals.calories || "Not set"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            kcal
                          </span>
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Protein Goal
                        </div>
                        <div className="text-xl font-bold text-emerald-700">
                          {goals.protein || "Not set"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Carbs Goal
                        </div>
                        <div className="text-xl font-bold text-amber-700">
                          {goals.carbs || "Not set"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Fat Goal
                        </div>
                        <div className="text-xl font-bold text-red-700">
                          {goals.fat || "Not set"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            g
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={() => (window.location.href = "/settings")}
                        variant="outline"
                        className="text-sm"
                      >
                        Update Goals
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
