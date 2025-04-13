"use client";

import { SetStateAction, useState } from "react";
import { Info, ArrowRight } from "lucide-react";

export default function CalorieCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [bodyFat, setBodyFat] = useState(20);
  const [formula, setFormula] = useState("mifflin");
  const [showInfo, setShowInfo] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(2000);

  // Calculate BMR based on selected formula
  const calculateBMR = () => {
    // Convert weight from kg to kg
    const weightInKg = weight;
    // Convert height from cm to cm
    const heightInCm = height;

    let bmr = 0;

    if (formula === "mifflin") {
      if (gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
      }
    } else if (formula === "harris") {
      if (gender === "male") {
        bmr = 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * age + 88.362;
      } else {
        bmr = 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * age + 447.593;
      }
    } else if (formula === "katch") {
      bmr = 370 + 21.6 * (1 - bodyFat / 100) * weightInKg;
    }

    return Math.round(bmr);
  };

  // Calculate total daily calories
  const calculateCalories = () => {
    const bmr = calculateBMR();
    return Math.round(bmr * activityLevel);
  };

  const maintenanceCalories = calculateCalories();
  const deficitCalories = Math.round(maintenanceCalories - 500);
  const surplusCalories = Math.round(maintenanceCalories + 500);

  const activityOptions = [
    { value: 1.2, label: "Sedentary (office job)" },
    { value: 1.375, label: "Light Exercise (1-2 days/week)" },
    { value: 1.55, label: "Moderate Exercise (3-5 days/week)" },
    { value: 1.725, label: "Heavy Exercise (6-7 days/week)" },
    { value: 1.9, label: "Athlete (2x per day)" },
  ];

  const updateGoal = async (calories: SetStateAction<number>) => {
    try {
      const response = await fetch("/api/user/calorie-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dailyCalorieGoal: calories,
        }),
      });

      if (response.ok) {
        setCurrentGoal(calories);
      } else {
        console.error("Failed to update calorie goal");
      }
    } catch (error) {
      console.error("Error updating calorie goal:", error);
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
      suppressHydrationWarning
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Calorie Calculator
          </h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
            aria-label="Information"
          >
            <Info className="h-5 w-5 text-blue-500" />
          </button>
        </div>

        {showInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-gray-700">
            <p className="mb-2">
              This calculator uses the following formulas to determine your
              basal metabolic rate (BMR):
            </p>
            <p className="mb-1">
              <strong>Mifflin-St Jeor Equation:</strong>
            </p>
            <p className="mb-1">For men: BMR = 10W + 6.25H - 5A + 5</p>
            <p className="mb-1">For women: BMR = 10W + 6.25H - 5A - 161</p>
            <p className="mt-2 mb-1">
              <strong>Revised Harris-Benedict Equation:</strong>
            </p>
            <p className="mb-1">
              For men: BMR = 13.397W + 4.799H - 5.677A + 88.362
            </p>
            <p className="mb-1">
              For women: BMR = 9.247W + 3.098H - 4.330A + 447.593
            </p>
            <p className="mt-2 mb-1">
              <strong>Katch-McArdle Formula:</strong>
            </p>
            <p className="mb-1">BMR = 370 + 21.6(1 - F)W</p>
            <p className="mt-2">
              Where: W is body weight in kg, H is body height in cm, A is age, F
              is body fat in percentage
            </p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                  Female
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              min="15"
              max="80"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              min="40"
              max="200"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              min="130"
              max="230"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="activity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Activity Level
            </label>
            <select
              id="activity"
              value={activityLevel}
              onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {activityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="formula"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Calculation Formula
            </label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mifflin"
                  name="formula"
                  value="mifflin"
                  checked={formula === "mifflin"}
                  onChange={() => setFormula("mifflin")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="mifflin" className="ml-2 text-sm text-gray-700">
                  Mifflin-St Jeor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="harris"
                  name="formula"
                  value="harris"
                  checked={formula === "harris"}
                  onChange={() => setFormula("harris")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="harris" className="ml-2 text-sm text-gray-700">
                  Harris-Benedict
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="katch"
                  name="formula"
                  value="katch"
                  checked={formula === "katch"}
                  onChange={() => setFormula("katch")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="katch" className="ml-2 text-sm text-gray-700">
                  Katch-McArdle
                </label>
              </div>
            </div>
          </div>

          {formula === "katch" && (
            <div className="md:col-span-2">
              <label
                htmlFor="bodyFat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Body Fat Percentage
              </label>
              <input
                type="number"
                id="bodyFat"
                min="5"
                max="50"
                value={bodyFat}
                onChange={(e) => setBodyFat(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Daily Calorie Targets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className="border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => updateGoal(deficitCalories)}
            >
              <div className="bg-blue-50 p-3 border-b border-blue-100">
                <h4 className="font-medium text-blue-700">Weight Loss</h4>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gray-900">
                  {deficitCalories}
                </p>
                <p className="text-sm text-gray-500 mt-1">calories/day</p>
                <p className="text-xs text-gray-400 mt-2">
                  500 calorie deficit
                </p>
              </div>
            </div>

            <div
              className="border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => updateGoal(maintenanceCalories)}
            >
              <div className="bg-green-50 p-3 border-b border-green-100">
                <h4 className="font-medium text-green-700">Maintain</h4>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gray-900">
                  {maintenanceCalories}
                </p>
                <p className="text-sm text-gray-500 mt-1">calories/day</p>
                <p className="text-xs text-gray-400 mt-2">
                  maintain current weight
                </p>
              </div>
            </div>

            <div
              className="border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => updateGoal(surplusCalories)}
            >
              <div className="bg-amber-50 p-3 border-b border-amber-100">
                <h4 className="font-medium text-amber-700">Weight Gain</h4>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-gray-900">
                  {surplusCalories}
                </p>
                <p className="text-sm text-gray-500 mt-1">calories/day</p>
                <p className="text-xs text-gray-400 mt-2">
                  500 calorie surplus
                </p>
              </div>
            </div>
          </div>

          {/* Current Goal Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Your Current Calorie Goal
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {currentGoal}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    calories/day
                  </span>
                </p>
              </div>
              <button
                onClick={() => (window.location.href = "/settings")}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Update Goal
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
