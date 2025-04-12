"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Zap,
  Cookie,
  Droplet,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DayData {
  date: string; // ISO format: YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface EnhancedCalendarProps {
  dayData: DayData[];
  nutritionGoals?: {
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
}

export default function EnhancedCalendarView({
  dayData,
  nutritionGoals,
}: EnhancedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "day">("month");
  const router = useRouter();

  const onDateClick = (day: Date) => {
    // Use UTC methods to get a timezone-neutral date string
    const year = day.getUTCFullYear();
    const month = String(day.getUTCMonth() + 1).padStart(2, "0");
    const dayNum = String(day.getUTCDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${dayNum}`;

    // Always set the selected date
    setSelectedDate(day);

    // Find data for this date - using the direct string format matching
    const matchingData = dayData.find((d) => d.date === dateString);

    if (matchingData) {
      setSelectedDayData(matchingData);
      setCalendarView("day");
    } else {
      // Navigate to add food for this day
      router.push(`/day/${dateString}`);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goBackToCalendar = () => setCalendarView("month");

  // Get days for the current month view
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Determine the first day of the week for the first day of the month
    const startDay = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Create an array of blanks for days from previous month
    const blanks = Array(startDay).fill(null);

    return [...blanks, ...daysInMonth];
  };

  // Get color based on calories compared to goal
  const getCalorieColor = (calories: number) => {
    const goal = nutritionGoals?.calories || 2000;

    const percentage = (calories / goal) * 100;

    if (calories === 0) return "bg-gray-100 text-gray-500";
    if (percentage < 80) return "bg-blue-100 text-blue-600";
    if (percentage <= 100) return "bg-green-100 text-green-600";
    if (percentage <= 115) return "bg-amber-100 text-amber-600";
    return "bg-red-100 text-red-600";
  };

  const getDataForDay = (day: Date) => {
    // Format the date in the same way it's stored in API data
    const year = day.getUTCFullYear();
    const month = String(day.getUTCMonth() + 1).padStart(2, "0");
    const dayNum = String(day.getUTCDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${dayNum}`;

    return dayData.find((d) => d.date === dateString);
  };

  const renderDayCell = (day: Date | null, index: number) => {
    if (!day) {
      // Empty cell for days from previous/next month
      return (
        <div
          key={`empty-${index}`}
          className="h-24 p-2 border border-transparent rounded-lg"
        ></div>
      );
    }

    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate && isSameDay(day, selectedDate);

    // Check if date is in the future
    const isFutureDate = day > new Date();

    // Get data for this day
    const data = getDataForDay(day);
    const hasData = !!data && data.calories > 0;

    // Base classes for the day cell
    let cellClasses = "h-20 p-2 border rounded-lg transition-all ";

    // Add hover and cursor styles only if not a future date
    if (!isFutureDate) {
      cellClasses += "hover:shadow-md cursor-pointer ";
    } else {
      cellClasses += "opacity-40 cursor-not-allowed ";
    }

    if (!isCurrentMonth) {
      cellClasses += "opacity-40 ";
    }

    if (isToday) {
      cellClasses += "border-blue-300 bg-blue-50 ";
    } else if (hasData) {
      cellClasses += "border-green-200 bg-green-50 ";
    } else {
      cellClasses += "border-gray-200 ";
    }

    if (isSelected) {
      cellClasses += "ring-2 ring-blue-500 ";
    }

    return (
      <div
        key={format(day, "yyyy-MM-dd")}
        className={cellClasses}
        onClick={() => !isFutureDate && onDateClick(day)}
      >
        <div className="flex flex-col h-full">
          {/* Day number */}
          <div
            className={`text-right font-medium text-sm ${
              isToday ? "text-blue-700" : isFutureDate ? "text-gray-400" : ""
            }`}
          >
            {format(day, "d")}
          </div>

          {/* Day data indicator */}
          {hasData && (
            <div className="mt-auto">
              <div
                className={`text-xs font-semibold px-1 py-0.5 rounded-md text-center ${getCalorieColor(
                  data.calories
                )}`}
              >
                {data.calories} cal
              </div>
              <div className="flex justify-center space-x-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDayDetail = () => {
    if (!selectedDayData || !selectedDate) return null;

    const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");

    return (
      <div className="p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-900">
            {formattedDate}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={goBackToCalendar}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Calories</h3>
                </div>
                <div className="mt-1 text-3xl font-bold text-gray-900">
                  {selectedDayData.calories}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/day/${selectedDayData.date}`)}
              className="text-sm"
            >
              View Details
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">
              Macronutrient Breakdown
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mb-3">
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Zap className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">Protein</span>
            </div>
            <span className="text-xl font-bold text-emerald-700">
              {selectedDayData.protein.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">grams</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Cookie className="h-4 w-4 text-amber-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">Carbs</span>
            </div>
            <span className="text-xl font-bold text-amber-700">
              {selectedDayData.carbs.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">grams</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Droplet className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">Fat</span>
            </div>
            <span className="text-xl font-bold text-red-700">
              {selectedDayData.fat.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">grams</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => router.push(`/day/${selectedDayData.date}`)}
            className="text-sm flex items-center"
            variant="outline"
          >
            Edit Food Log
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };
  return (
    <Card className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {calendarView === "month"
              ? format(currentMonth, "MMMM yyyy")
              : "Daily Breakdown"}
          </CardTitle>

          {calendarView === "month" && (
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={prevMonth}
                className="p-1.5 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="p-1.5 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {calendarView === "month" && (
          <div className="animate-fade-in">
            {/* Day labels */}
            <div className="grid grid-cols-7 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center font-medium text-gray-500 text-sm py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((day, index) => renderDayCell(day, index))}
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm text-gray-500">
                Click on a day to view or add food entries
              </div>

              <div className="flex justify-center space-x-4 mt-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-50 border border-green-200 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Has data</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">
                    Future (disabled)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {calendarView === "day" && renderDayDetail()}
      </CardContent>
    </Card>
  );
}
