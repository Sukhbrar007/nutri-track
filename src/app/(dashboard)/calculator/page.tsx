"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WeightCalculator from "@/components/calculator/WeightCalculator";

function CalculatorPageContent() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch user settings");
        }

        const data = await response.json();
        setDailyCalorieGoal(data.settings.dailyCalorieGoal);
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Weight Calculator
      </h1>
      <p className="mb-8 text-gray-600">
        Calculate your basal metabolic rate, daily calorie needs, and track your
        surplus/deficit based on your nutrition goals.
      </p>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <WeightCalculator dailyCalorieGoal={dailyCalorieGoal} />
      )}
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalculatorPageContent />
    </Suspense>
  );
}
