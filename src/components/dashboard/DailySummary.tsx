/* eslint-disable react/no-unescaped-entities */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Target, Droplet, Zap, Cookie } from "lucide-react";

interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  summary: NutritionSummary;
  goals: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
}

export default function DailySummary({ summary, goals }: DailySummaryProps) {
  // Default values if data is missing
  const safeCalories = summary?.calories || 0;
  const safeProtein = summary?.protein || 0;
  const safeCarbs = summary?.carbs || 0;
  const safeFat = summary?.fat || 0;

  const safeCalorieGoal = goals?.calories || 2000; // Default if not set
  const safeProteinGoal = goals?.protein || 150;
  const safeCarbsGoal = goals?.carbs || 200;
  const safeFatGoal = goals?.fat || 65;

  // Calculate remaining calories
  const remainingCalories = safeCalorieGoal - safeCalories;

  // Calculate calorie status
  const getCalorieStatus = () => {
    if (!goals.calories)
      return { label: "No goal set", color: "text-gray-500" };

    const percentage = Math.min(
      Math.round((safeCalories / safeCalorieGoal) * 100),
      100
    );

    if (percentage < 80)
      return {
        label: "Under goal",
        color: "text-amber-500",
      };
    if (percentage <= 100)
      return {
        label: "On target",
        color: "text-emerald-500",
      };
    return {
      label: "Over goal",
      color: "text-red-500",
    };
  };

  const calorieStatus = getCalorieStatus();

  return (
    <Card className="bg-white shadow-md border-0 rounded-xl overflow-hidden hover-card animate-fade-in">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Today's Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-gray-900">Calories</h3>
              </div>
              <div className="flex items-baseline mt-1">
                <span className="text-3xl font-bold">{safeCalories}</span>
                <span className="text-gray-500 ml-1">/ {safeCalorieGoal}</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-sm font-medium ${calorieStatus.color}`}>
                {calorieStatus.label}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                {remainingCalories > 0
                  ? `${remainingCalories} remaining`
                  : remainingCalories < 0
                  ? `${Math.abs(remainingCalories)} over`
                  : "Target reached"}
              </div>
            </div>
          </div>
        </div>

        {/* Macronutrient Breakdown Section */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Macronutrient Breakdown
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-600 mb-4">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
                <span>Protein</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                <span>Carbs</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Fat</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Protein */}
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 text-emerald-500 mr-1" />
                <h4 className="text-sm font-medium text-gray-700">Protein</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-emerald-700">
                  {safeProtein.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  / {safeProteinGoal} g
                </span>
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Cookie className="h-4 w-4 text-amber-500 mr-1" />
                <h4 className="text-sm font-medium text-gray-700">Carbs</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-amber-700">
                  {safeCarbs.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  / {safeCarbsGoal} g
                </span>
              </div>
            </div>

            {/* Fat */}
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Droplet className="h-4 w-4 text-red-500 mr-1" />
                <h4 className="text-sm font-medium text-gray-700">Fat</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-red-700">
                  {safeFat.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  / {safeFatGoal} g
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
