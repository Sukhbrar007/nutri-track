"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  AlertCircle,
  CheckCircle,
  User,
  Target,
  Save,
  ArrowLeft,
} from "lucide-react";

interface UserSettings {
  dailyCalorieGoal: number | null;
  dailyProteinGoal: number | null;
  dailyCarbGoal: number | null;
  dailyFatGoal: number | null;
}

function SettingsPageContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 150,
    dailyCarbGoal: 200,
    dailyFatGoal: 65,
  });

  const proteinCalories = (settings.dailyProteinGoal || 0) * 4;
  const carbCalories = (settings.dailyCarbGoal || 0) * 4;
  const fatCalories = (settings.dailyFatGoal || 0) * 9;
  const totalCalories = settings.dailyCalorieGoal || 0;

  const proteinPercentage = totalCalories
    ? Math.round((proteinCalories / totalCalories) * 100)
    : 0;
  const carbPercentage = totalCalories
    ? Math.round((carbCalories / totalCalories) * 100)
    : 0;
  const fatPercentage = totalCalories
    ? Math.round((fatCalories / totalCalories) * 100)
    : 0;

  useEffect(() => {
    const fetchUserSettings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to fetch user settings");
        }

        const data = await response.json();
        setSettings(data.settings);
      } catch (error) {
        console.error("Error fetching user settings:", error);
        setError("Could not load your settings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUserSettings();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue: number | null = value === "" ? null : parseInt(value);

    setSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess("Your nutrition goals have been updated successfully.");

      // Redirect after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save your settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      suppressHydrationWarning
    >
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="mr-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition focus:outline-none"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Customize your nutrition goals and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-white border border-gray-100 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-semibold mb-4">
                {session.user.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                {session.user.name || "User"}
              </h3>
              <p className="text-gray-500 mb-6">{session.user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Goals Card */}
        <Card className="bg-white border border-gray-100 shadow-md lg:col-span-2">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" /> Nutrition Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Nutritional Goals */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="dailyCalorieGoal"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Daily Calorie Goal (kcal)
                    </label>
                    <input
                      id="dailyCalorieGoal"
                      name="dailyCalorieGoal"
                      type="number"
                      min="0"
                      value={
                        settings.dailyCalorieGoal === null
                          ? ""
                          : settings.dailyCalorieGoal
                      }
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Macronutrients */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-700">
                      Macronutrients
                    </h3>

                    {/* Macro distribution visualization */}
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 mr-2">
                        P: {proteinPercentage}%
                      </span>

                      <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 mr-2">
                        C: {carbPercentage}%
                      </span>

                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">
                        F: {fatPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual representation of macros */}
                  <div className="w-full h-2 flex rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${proteinPercentage}%` }}
                      title={`Protein: ${proteinPercentage}%`}
                    ></div>
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${carbPercentage}%` }}
                      title={`Carbs: ${carbPercentage}%`}
                    ></div>
                    <div
                      className="bg-red-500 h-full"
                      style={{ width: `${fatPercentage}%` }}
                      title={`Fat: ${fatPercentage}%`}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="dailyProteinGoal"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Protein Goal (g)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <input
                          id="dailyProteinGoal"
                          name="dailyProteinGoal"
                          type="number"
                          min="0"
                          value={
                            settings.dailyProteinGoal === null
                              ? ""
                              : settings.dailyProteinGoal
                          }
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dailyCarbGoal"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Carbs Goal (g)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                        <input
                          id="dailyCarbGoal"
                          name="dailyCarbGoal"
                          type="number"
                          min="0"
                          value={
                            settings.dailyCarbGoal === null
                              ? ""
                              : settings.dailyCarbGoal
                          }
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dailyFatGoal"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Fat Goal (g)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <input
                          id="dailyFatGoal"
                          name="dailyFatGoal"
                          type="number"
                          min="0"
                          value={
                            settings.dailyFatGoal === null
                              ? ""
                              : settings.dailyFatGoal
                          }
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
