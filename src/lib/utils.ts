/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateTotalNutrition(foods: any[]) {
  return foods.reduce(
    (acc, foodLog) => {
      const quantity = foodLog.quantity || 1;
      acc.calories += foodLog.food.calories * quantity;
      acc.protein += foodLog.food.protein * quantity;
      acc.carbs += foodLog.food.carbs * quantity;
      acc.fat += foodLog.food.fat * quantity;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function calculateProgress(
  current: number,
  goal: number | null | undefined
): number {
  if (!goal || goal <= 0) return 0;
  const percentage = (current / goal) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
}

export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
