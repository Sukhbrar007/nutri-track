/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format, subDays, isAfter, addDays, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface EnhancedNutritionChartProps {
  data: DayData[];
  nutritionGoals?: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
}

type ChartMetric = "calories" | "macros";
type Period = "7days" | "14days" | "30days" | "90days";

export default function NutritionStats({
  data,
  nutritionGoals,
}: EnhancedNutritionChartProps) {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("calories");
  const [periodFilter, setPeriodFilter] = useState<Period>("7days");
  const [showDropdown, setShowDropdown] = useState(false);

  // Process data based on period filter
  const getFilteredData = () => {
    const today = new Date();
    let daysToSubtract = 7;

    switch (periodFilter) {
      case "14days":
        daysToSubtract = 14;
        break;
      case "30days":
        daysToSubtract = 30;
        break;
      case "90days":
        daysToSubtract = 90;
        break;
      default:
        daysToSubtract = 7;
    }

    const startDate = subDays(today, daysToSubtract);

    // Filter data within date range and shift dates forward by 1 day
    return data
      .filter((day) => {
        const dayDate = new Date(day.date);
        return (
          isAfter(dayDate, startDate) ||
          day.date === format(startDate, "yyyy-MM-dd")
        );
      })
      .map((day) => {
        // Create a new object with date shifted forward by 1 day
        const originalDate = parseISO(day.date);
        const shiftedDate = addDays(originalDate, 1);
        return {
          ...day,
          date: format(shiftedDate, "yyyy-MM-dd"),
          displayDate: format(shiftedDate, "yyyy-MM-dd"), // Keep original for reference if needed
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredData = getFilteredData();

  // Determine chart dimensions
  const chartHeight = 200;
  const chartWidth = 100;
  const barWidth = 12;
  const barSpacing = 10;

  // Find the max value for scaling
  const getMaxValue = () => {
    if (chartMetric === "calories") {
      const maxCalories = Math.max(...filteredData.map((d) => d.calories), 0);
      // Use goal as minimum max if it exists and is higher than data max
      const goalMax = nutritionGoals?.calories || 0;
      return Math.max(maxCalories, goalMax, 500);
    } else {
      const maxProtein = Math.max(...filteredData.map((d) => d.protein), 0);
      const maxCarbs = Math.max(...filteredData.map((d) => d.carbs), 0);
      const maxFat = Math.max(...filteredData.map((d) => d.fat), 0);

      const goalMaxProtein = nutritionGoals?.protein || 0;
      const goalMaxCarbs = nutritionGoals?.carbs || 0;
      const goalMaxFat = nutritionGoals?.fat || 0;

      return Math.max(
        maxProtein,
        maxCarbs,
        maxFat,
        goalMaxProtein,
        goalMaxCarbs,
        goalMaxFat,
        50
      );
    }
  };

  const maxValue = getMaxValue();

  // Scale value to chart height
  const scaleValue = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  // Get Y-axis tick values
  const getYAxisTicks = () => {
    const ticks = [];
    const numTicks = 5;
    const tickStep = maxValue / (numTicks - 1);

    for (let i = 0; i < numTicks; i++) {
      const value = Math.round(i * tickStep);
      ticks.push(value);
    }

    return ticks.reverse(); // Start from the top
  };

  // Get bar color based on goal achievement
  const getBarColor = (value: number, goalValue: number | null | undefined) => {
    // Handle undefined case by converting to null
    const safeGoalValue = goalValue === undefined ? null : goalValue;

    if (!safeGoalValue) return "bg-blue-400"; // Default if no goal

    // Calculate percentage of goal
    const percentage = (value / safeGoalValue) * 100;

    if (value === 0) return "bg-gray-300"; // Empty bar
    if (percentage < 80) return "bg-blue-400"; // Under goal - blue
    if (percentage <= 100) return "bg-green-500"; // Reached goal - green
    return "bg-red-400"; // Over goal - red
  };

  // Handle period change
  const handlePeriodChange = (period: Period) => {
    setPeriodFilter(period);
    setShowDropdown(false);
  };

  // Get period text
  const getPeriodText = (period: Period) => {
    switch (period) {
      case "7days":
        return "Last 7 days";
      case "14days":
        return "Last 14 days";
      case "30days":
        return "Last 30 days";
      case "90days":
        return "Last 90 days";
    }
  };

  // Format date label - this now shows the shifted date
  const formatDateLabel = (dateStr: string) => {
    return format(new Date(dateStr), "d MMM");
  };

  return (
    <Card className="bg-white shadow-md border-0 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Nutrition Overview
          </CardTitle>

          <div className="flex items-center">
            <div className="flex border border-gray-200 rounded-lg mr-2 overflow-hidden">
              <Button
                variant={chartMetric === "calories" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartMetric("calories")}
                className={`text-xs py-1 px-3 font-medium ${
                  chartMetric === "calories"
                    ? "bg-primary text-black"
                    : "bg-transparent text-gray-600"
                } rounded-none`}
              >
                Calories
              </Button>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xs flex items-center"
              >
                {getPeriodText(periodFilter)}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-100 py-1">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      periodFilter === "7days" ? "bg-blue-50 text-blue-600" : ""
                    }`}
                    onClick={() => handlePeriodChange("7days")}
                  >
                    Last 7 days
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      periodFilter === "14days"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handlePeriodChange("14days")}
                  >
                    Last 14 days
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      periodFilter === "30days"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handlePeriodChange("30days")}
                  >
                    Last 30 days
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      periodFilter === "90days"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handlePeriodChange("90days")}
                  >
                    Last 90 days
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 text-lg mb-2">No data available</div>
            <div className="text-gray-500 text-sm">
              Track your meals to see your nutrition overview
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Y-axis labels */}
            <div
              className="absolute left-0 top-4 bottom-8 flex flex-col justify-between"
              style={{ width: "40px" }}
            >
              {getYAxisTicks().map((tick, i) => (
                <div key={i} className="flex items-center justify-end w-full">
                  <span className="text-xs text-gray-500 pr-2">{tick}</span>
                  <div className="border-t border-gray-100 absolute left-12 right-0"></div>
                </div>
              ))}
            </div>

            {/* Goal line for calories */}
            {chartMetric === "calories" && nutritionGoals?.calories && (
              <div
                className="absolute left-12 right-4 border-t border-dashed border-blue-400 z-10"
                style={{
                  top: `${
                    chartHeight - scaleValue(nutritionGoals.calories) + 4
                  }px`,
                }}
              >
                <div className="absolute top-0 right-0 transform -translate-y-1/2 bg-blue-50 text-blue-600 text-xs px-1 rounded">
                  Goal: {nutritionGoals.calories}
                </div>
              </div>
            )}

            {/* Goal lines for macros */}
            {chartMetric === "macros" && (
              <>
                {nutritionGoals?.protein && (
                  <div
                    className="absolute left-12 right-4 border-t border-dashed border-emerald-400 z-10"
                    style={{
                      top: `${
                        chartHeight - scaleValue(nutritionGoals.protein) + 4
                      }px`,
                    }}
                  >
                    <div className="absolute top-0 right-0 transform -translate-y-1/2 bg-emerald-50 text-emerald-600 text-xs px-1 rounded">
                      P: {nutritionGoals.protein}g
                    </div>
                  </div>
                )}

                {nutritionGoals?.carbs && (
                  <div
                    className="absolute left-12 right-4 border-t border-dashed border-amber-400 z-10"
                    style={{
                      top: `${
                        chartHeight - scaleValue(nutritionGoals.carbs) + 4
                      }px`,
                    }}
                  >
                    <div className="absolute top-0 right-0 transform -translate-y-1/2 bg-amber-50 text-amber-600 text-xs px-1 rounded">
                      C: {nutritionGoals.carbs}g
                    </div>
                  </div>
                )}

                {nutritionGoals?.fat && (
                  <div
                    className="absolute left-12 right-4 border-t border-dashed border-red-400 z-10"
                    style={{
                      top: `${
                        chartHeight - scaleValue(nutritionGoals.fat) + 4
                      }px`,
                    }}
                  >
                    <div className="absolute top-0 right-0 transform -translate-y-1/2 bg-red-50 text-red-600 text-xs px-1 rounded">
                      F: {nutritionGoals.fat}g
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Chart container */}
            <div
              className="ml-12 overflow-auto pb-8 pt-4 pr-4"
              style={{ maxWidth: "calc(100% - 12px)" }}
            >
              <div
                className="flex items-end space-x-2 relative"
                style={{
                  height: `${chartHeight}px`,
                  width: Math.max(
                    (barWidth + barSpacing) * filteredData.length + barSpacing,
                    chartHeight
                  ),
                }}
              >
                {/* Background grid */}
                <div className="absolute inset-0 z-0">
                  {getYAxisTicks().map((_, i) => (
                    <div
                      key={i}
                      className="border-t border-gray-100 absolute left-0 right-0"
                      style={{
                        top: `${
                          (i / (getYAxisTicks().length - 1)) * chartHeight
                        }px`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Bars */}
                {filteredData.map((day, index) => (
                  <div key={day.date} className="flex flex-col items-center">
                    {chartMetric === "calories" ? (
                      // Calories bar with goal-based coloring
                      <div
                        className="relative"
                        style={{ width: `${barWidth}px` }}
                      >
                        <div
                          className={`w-full rounded-t-md ${getBarColor(
                            day.calories,
                            nutritionGoals?.calories
                          )}`}
                          style={{
                            height: `${scaleValue(day.calories)}px`,
                          }}
                        ></div>
                      </div>
                    ) : (
                      // Macros bars with goal-based coloring
                      <div
                        className="flex space-x-1"
                        style={{ width: `${barWidth * 3 + 2}px` }}
                      >
                        <div
                          className="relative"
                          style={{ width: `${barWidth}px` }}
                        >
                          <div
                            className={`w-full rounded-t-md ${getBarColor(
                              day.protein,
                              nutritionGoals?.protein
                            )}`}
                            style={{
                              height: `${scaleValue(day.protein)}px`,
                            }}
                          ></div>
                        </div>
                        <div
                          className="relative"
                          style={{ width: `${barWidth}px` }}
                        >
                          <div
                            className={`w-full rounded-t-md ${getBarColor(
                              day.carbs,
                              nutritionGoals?.carbs
                            )}`}
                            style={{
                              height: `${scaleValue(day.carbs)}px`,
                            }}
                          ></div>
                        </div>
                        <div
                          className="relative"
                          style={{ width: `${barWidth}px` }}
                        >
                          <div
                            className={`w-full rounded-t-md ${getBarColor(
                              day.fat,
                              nutritionGoals?.fat
                            )}`}
                            style={{
                              height: `${scaleValue(day.fat)}px`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* X-axis labels */}
                    <div className="mt-2 text-xs text-gray-500 whitespace-nowrap">
                      {formatDateLabel(day.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex justify-center space-x-4">
              {chartMetric === "calories" ? (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Under Goal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Goal Reached</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Over Goal</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Goal Reached</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Under Goal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-sm mr-1"></div>
                    <span className="text-xs text-gray-500">Over Goal</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
