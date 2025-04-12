"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calculator,
  Activity,
  Scale,
  Ruler,
  Clock,
  UserCircle2,
  TrendingUp,
  TrendingDown,
  Flame,
  Utensils,
  ArrowRight,
} from "lucide-react";

interface CalorieCalculatorProps {
  dailyCalorieGoal: number | null;
}

export default function WeightCalculator({
  dailyCalorieGoal,
}: CalorieCalculatorProps) {
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");

  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [calorieDeficit, setCalorieDeficit] = useState<number | null>(null);

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days per week
    moderate: 1.55, // Moderate exercise 3-5 days per week
    active: 1.725, // Heavy exercise 6-7 days per week
    veryActive: 1.9, // Very heavy exercise, physical job or training twice a day
  };

  // Goal adjustments (percentage of TDEE)
  const goalAdjustments = {
    deficit: -500, // 500 calorie deficit for weight loss
    maintain: 0,
    surplus: 500, // 500 calorie surplus for weight gain
  };

  useEffect(() => {
    if (weight && height && age && gender && activityLevel) {
      calculateBMR();
    }
  }, [weight, height, age, gender, activityLevel, goal]);

  const calculateBMR = () => {
    let calculatedBMR: number;

    // Mifflin-St Jeor Equation for BMR
    if (gender === "male") {
      calculatedBMR =
        10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5;
    } else {
      calculatedBMR =
        10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;
    }

    setBmr(Math.round(calculatedBMR));

    // Calculate TDEE (Total Daily Energy Expenditure)
    const calculatedTDEE =
      calculatedBMR *
      activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    setTdee(Math.round(calculatedTDEE));

    // Calculate target calories based on goal
    const adjustedCalories =
      calculatedTDEE + goalAdjustments[goal as keyof typeof goalAdjustments];
    setTargetCalories(Math.round(adjustedCalories));

    // Calculate deficit/surplus compared to user's actual calorie intake
    if (dailyCalorieGoal) {
      setCalorieDeficit(Math.round(dailyCalorieGoal - adjustedCalories));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMR();
  };

  const getWeightChangePerWeek = (caloricDifference: number) => {
    // 3500 calories deficit/surplus = 1 pound of weight change
    const poundsPerWeek = (caloricDifference * 7) / 3500;
    return Math.abs(poundsPerWeek).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle className="text-xl font-semibold">
              Weight & Nutrition Calculator
            </CardTitle>
          </div>
          <CardDescription>
            Calculate your daily calorie needs based on your body metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Body Metrics Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                Your Body Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Gender Selection */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gender
                    </label>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          gender === "male"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          gender === "female"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Age Input */}
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Age
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="age"
                        type="number"
                        min="15"
                        max="100"
                        value={age}
                        onChange={(e) =>
                          setAge(e.target.value ? Number(e.target.value) : "")
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Your age"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Weight Input */}
                  <div>
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Scale className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="weight"
                        type="number"
                        min="30"
                        max="300"
                        value={weight}
                        onChange={(e) =>
                          setWeight(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Your weight"
                      />
                    </div>
                  </div>

                  {/* Height Input */}
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Height (cm)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ruler className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="height"
                        type="number"
                        min="100"
                        max="250"
                        value={height}
                        onChange={(e) =>
                          setHeight(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Your height"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity & Goal Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 text-blue-500 mr-2" />
                Activity & Goal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="activityLevel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Activity Level
                  </label>
                  <select
                    id="activityLevel"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="light">
                      Light (exercise 1-3 days/week)
                    </option>
                    <option value="moderate">
                      Moderate (exercise 3-5 days/week)
                    </option>
                    <option value="active">
                      Active (exercise 6-7 days/week)
                    </option>
                    <option value="veryActive">
                      Very Active (physical job or 2x training)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="goal"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Goal
                  </label>
                  <select
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="deficit">
                      Weight Loss (500 cal deficit)
                    </option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="surplus">
                      Weight Gain (500 cal surplus)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Calculate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {bmr !== null && tdee !== null && targetCalories !== null && (
        <Card className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Flame className="h-5 w-5 text-emerald-500 mr-2" />
              Your Results
            </CardTitle>
            <CardDescription>
              Based on your body metrics and activity level
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <div className="text-sm text-gray-500">
                    Basal Metabolic Rate
                  </div>
                  <div className="text-2xl font-bold text-gray-900 my-1">
                    {bmr} calories
                  </div>
                  <div className="text-xs text-gray-500">
                    Calories your body needs at complete rest
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm text-center">
                  <div className="text-sm text-gray-600">
                    Total Daily Energy Expenditure
                  </div>
                  <div className="text-2xl font-bold text-blue-700 my-1">
                    {tdee} calories
                  </div>
                  <div className="text-xs text-gray-600">
                    Calories you burn per day with activity
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <div className="text-sm text-gray-600">
                    Target Daily Calories
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 my-1">
                    {targetCalories} calories
                  </div>
                  <div className="text-xs text-gray-600">
                    Recommended daily intake for your goal
                  </div>
                </div>
              </div>

              {dailyCalorieGoal && calorieDeficit !== null && (
                <div className="mt-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-900">
                        Your Current Daily Calorie Goal
                      </div>
                      <div className="text-3xl font-bold mt-1">
                        {dailyCalorieGoal} calories
                      </div>
                    </div>

                    <div className="flex items-center justify-center my-6">
                      <div className="text-xl font-bold text-gray-500">
                        {targetCalories}
                      </div>
                      <div className="mx-4 flex-1 max-w-xs">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              calorieDeficit > 0
                                ? "bg-blue-500"
                                : calorieDeficit < 0
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: "100%",
                              transform: `translateX(${
                                calorieDeficit > 0
                                  ? (calorieDeficit / targetCalories) * 50 + "%"
                                  : calorieDeficit < 0
                                  ? (calorieDeficit / targetCalories) * 50 + "%"
                                  : "0%"
                              })`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-500">
                        {dailyCalorieGoal}
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-start">
                        <div
                          className={`p-3 rounded-full mr-4 ${
                            calorieDeficit > 0
                              ? "bg-blue-100 text-blue-600"
                              : calorieDeficit < 0
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {calorieDeficit > 0 ? (
                            <TrendingUp className="h-6 w-6" />
                          ) : calorieDeficit < 0 ? (
                            <TrendingDown className="h-6 w-6" />
                          ) : (
                            <Utensils className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">
                            {calorieDeficit > 0
                              ? "Calorie Surplus"
                              : calorieDeficit < 0
                              ? "Calorie Deficit"
                              : "Perfect Balance"}
                          </h4>
                          <p className="text-gray-600">
                            {calorieDeficit > 0 ? (
                              <>
                                You&apos;re consuming{" "}
                                <span className="font-bold text-blue-600">
                                  {Math.abs(calorieDeficit)}
                                </span>{" "}
                                calories more than your target. This could lead
                                to a weight gain of approximately{" "}
                                <span className="font-bold text-blue-600">
                                  {getWeightChangePerWeek(calorieDeficit)}
                                </span>{" "}
                                pounds per week.
                              </>
                            ) : calorieDeficit < 0 ? (
                              <>
                                You&apos;re consuming{" "}
                                <span className="font-bold text-red-600">
                                  {Math.abs(calorieDeficit)}
                                </span>{" "}
                                calories less than your target. This could lead
                                to a weight loss of approximately{" "}
                                <span className="font-bold text-red-600">
                                  {getWeightChangePerWeek(calorieDeficit)}
                                </span>{" "}
                                pounds per week.
                              </>
                            ) : (
                              <>
                                Your calorie intake perfectly matches your
                                calculated needs.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <a
                        href="/settings"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Adjust your nutrition goals
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
