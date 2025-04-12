"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import DailySummary from "@/components/dashboard/DailySummary";
import FoodList from "@/components/food/FoodList";
import { calculateTotalNutrition } from "@/lib/utils";
import Loading from "@/components/Loading";

interface FoodLog {
  id: string;
  quantity: number;
  food: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function DayPage() {
  const { data: session } = useSession();
  const params = useParams<{ date: string }>();

  const [date, setDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [goals, setGoals] = useState({
    calories: null as number | null,
    protein: null as number | null,
    carbs: null as number | null,
    fat: null as number | null,
  });

  useEffect(() => {
    if (params.date) {
      const dateString = params.date as string;
      const parsedDate = parseISO(`${dateString}T12:00:00`);

      if (isValid(parsedDate)) {
        setDate(parsedDate);
      } else {
        setError("Invalid date format");
      }
    }
  }, [params.date]);

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const response = await fetch("/api/summary");

        if (!response.ok) {
          throw new Error("Failed to fetch user goals");
        }

        const data = await response.json();
        setGoals(data.goals);
      } catch (error) {
        console.error("Error fetching user goals:", error);
      }
    };

    if (session) {
      fetchUserGoals();
    }
  }, [session]);

  useEffect(() => {
    const fetchFoodLogs = async () => {
      if (!date) return;

      setIsLoading(true);
      setError(null);

      try {
        const dateString = params.date as string;
        const response = await fetch(`/api/log?date=${dateString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch food logs");
        }

        const data = await response.json();
        setFoodLogs(data.foodLogs);
      } catch (error) {
        console.error("Error fetching food logs:", error);
        setError("Could not load your food logs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session && date) {
      fetchFoodLogs();
    }
  }, [session, date, params.date]);

  if (!session || !date) {
    return null;
  }

  const formattedDate = format(date, "EEEE, MMMM d, yyyy");

  const dateString = params.date as string;

  const totals = calculateTotalNutrition(foodLogs);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard"
          className="mr-4 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{formattedDate}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-3">
          <Suspense fallback={<Loading />}>
            <DailySummary summary={totals} goals={goals} />
          </Suspense>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<Loading />}>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-100 h-24 rounded" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : (
              <FoodList
                foodLogs={foodLogs}
                date={dateString}
                onUpdate={() => {
                  const fetchFoodLogs = async () => {
                    try {
                      const response = await fetch(
                        `/api/log?date=${dateString}`
                      );
                      const data = await response.json();
                      setFoodLogs(data.foodLogs);
                    } catch (error) {
                      console.error("Error refetching food logs:", error);
                    }
                  };
                  fetchFoodLogs();
                }}
              />
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
