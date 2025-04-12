"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ChevronRight,
  ChevronDown,
  BarChart2,
  Calendar,
  Target,
  Zap,
  Plus,
} from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Simulate features data
  const features = [
    {
      title: "Track Your Nutrition",
      description:
        "Log your meals and track your daily calorie intake along with macronutrients - protein, carbs, and fats.",
      icon: <BarChart2 className="h-6 w-6 text-white" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Calendar View",
      description:
        "Visualize your nutrition data on a calendar and track your progress over time.",
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Set & Achieve Goals",
      description:
        "Set personalized nutrition goals and monitor your progress with insights and feedback.",
      icon: <Target className="h-6 w-6 text-white" />,
      color: "from-emerald-500 to-green-600",
    },
  ];

  // Trigger load animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Rotate through features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-b from-blue-100 to-indigo-100 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute top-60 -left-20 w-72 h-72 bg-gradient-to-b from-emerald-100 to-teal-100 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-64 h-64 bg-gradient-to-b from-amber-100 to-orange-100 rounded-full opacity-70 blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 md:pt-32 md:pb-24 lg:grid lg:grid-cols-12 lg:gap-8">
            <div
              className={`lg:col-span-6 text-center lg:text-left transition-all duration-1000 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Track Your</span>
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Nutrition Journey
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-3xl">
                Monitor your daily food intake, track calories and
                macronutrients, and achieve your health goals with NutriTracker.
              </p>

              <div className="mt-10">
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link href="/register">
                    <Button className="px-8 py-3 text-base font-medium rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
                      Get Started
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="px-8 py-3 text-base font-medium rounded-lg border-2 border-gray-300 transform transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center"
                    >
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-12 flex justify-center lg:justify-start">
                <a
                  href="#features"
                  className="flex flex-col items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium mb-1">Learn More</span>
                  <ChevronDown className="h-5 w-5 animate-bounce" />
                </a>
              </div>
            </div>

            {/* Hero Image/Visualization */}
            <div
              className={`mt-12 relative lg:mt-0 lg:col-span-6 transition-all duration-1000 transform ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="relative mx-auto w-full rounded-lg shadow-xl overflow-hidden lg:max-w-md">
                <div className="bg-white p-4 rounded-lg shadow-2xl">
                  {/* Visualization Header */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        Today&apos;s Summary
                      </div>
                      <div className="text-sm text-gray-500">
                        Monday, April 12
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      1,850 / 2,200 kcal
                    </div>
                  </div>

                  {/* Nutrition Bars */}
                  <div className="pt-4 space-y-4">
                    {/* Protein */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                          <span className="font-medium text-gray-700">
                            Protein
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          140g / 165g
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <span className="font-medium text-gray-700">
                            Carbs
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          180g / 230g
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-amber-500 h-2.5 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Fat */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="font-medium text-gray-700">Fat</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          55g / 73g
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Food Items */}
                  <div className="mt-6 space-y-2">
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Breakfast</div>
                        <div className="text-xs text-gray-500">
                          Oatmeal with Berries
                        </div>
                      </div>
                      <div className="text-sm font-semibold">320 kcal</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Lunch</div>
                        <div className="text-xs text-gray-500">
                          Chicken Salad
                        </div>
                      </div>
                      <div className="text-sm font-semibold">550 kcal</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Dinner</div>
                        <div className="text-xs text-gray-500">
                          Salmon with Vegetables
                        </div>
                      </div>
                      <div className="text-sm font-semibold">680 kcal</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Snack</div>
                        <div className="text-xs text-gray-500">
                          Greek Yogurt
                        </div>
                      </div>
                      <div className="text-sm font-semibold">300 kcal</div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="mt-4">
                    <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" /> Add Food
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,128L80,133.3C160,139,320,149,480,154.7C640,160,800,160,960,144C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose NutriTracker?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              The smart, intuitive way to monitor your nutrition and reach your
              health goals.
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              {/* Features List */}
              <div className="lg:col-span-5">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        activeFeature === index
                          ? "bg-white shadow-md transform -translate-x-2"
                          : "hover:bg-white/50"
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${feature.color}`}
                        >
                          {feature.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Link href="/register">
                    <Button className="px-6 py-3 text-base font-medium rounded-lg shadow bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center">
                      Start Your Journey Now
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Feature Visualization */}
              <div className="mt-10 lg:mt-0 lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105">
                  {activeFeature === 0 && (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Daily Nutrition Breakdown
                      </h3>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600">Calories</div>
                          <div className="text-2xl font-bold text-blue-700">
                            1,850
                          </div>
                          <div className="text-xs text-gray-500">kcal</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600">Protein</div>
                          <div className="text-2xl font-bold text-emerald-700">
                            140
                          </div>
                          <div className="text-xs text-gray-500">grams</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600">Carbs</div>
                          <div className="text-2xl font-bold text-amber-700">
                            180
                          </div>
                          <div className="text-xs text-gray-500">grams</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-1/4 text-sm font-medium text-gray-700">
                            Breakfast
                          </div>
                          <div className="w-3/4 ml-4">
                            <div
                              className="h-6 bg-blue-100 rounded"
                              style={{ width: "20%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/4 text-sm font-medium text-gray-700">
                            Lunch
                          </div>
                          <div className="w-3/4 ml-4">
                            <div
                              className="h-6 bg-blue-200 rounded"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/4 text-sm font-medium text-gray-700">
                            Dinner
                          </div>
                          <div className="w-3/4 ml-4">
                            <div
                              className="h-6 bg-blue-300 rounded"
                              style={{ width: "35%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/4 text-sm font-medium text-gray-700">
                            Snacks
                          </div>
                          <div className="w-3/4 ml-4">
                            <div
                              className="h-6 bg-blue-400 rounded"
                              style={{ width: "15%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature === 1 && (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Monthly Calendar View
                      </h3>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div
                            key={i}
                            className="text-sm font-medium text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                        {[...Array(35)].map((_, i) => (
                          <div
                            key={i}
                            className={`
                            h-14 rounded-lg flex flex-col items-center justify-center text-sm border
                            ${
                              i >= 3 && i <= 30
                                ? "border-gray-200"
                                : "border-transparent text-gray-300"
                            }
                            ${
                              [10, 11, 12, 17, 18, 19, 24, 25, 26].includes(i)
                                ? "bg-green-50 border-green-200"
                                : ""
                            }
                            ${i === 25 ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                          `}
                          >
                            <span>{i >= 3 && i <= 32 ? i - 2 : ""}</span>
                            {[10, 11, 12, 17, 18, 19, 24, 25, 26].includes(
                              i
                            ) && (
                              <div className="mt-1 w-4 h-1 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFeature === 2 && (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Goal Tracking
                      </h3>
                      <div className="mb-6">
                        <div className="flex justify-between items-baseline mb-2">
                          <div className="text-base font-medium">
                            Weight Goal
                          </div>
                          <div className="text-sm text-gray-600">
                            150 lbs → 140 lbs
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full"
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          70% complete
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            Daily Average
                          </div>
                          <div className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">
                              1,850
                            </div>
                            <div className="ml-1 text-sm text-emerald-600">
                              -350
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">calories</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            Weekly Progress
                          </div>
                          <div className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">
                              -1.2
                            </div>
                            <div className="ml-1 text-sm text-emerald-600">
                              lbs
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">this week</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Zap className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-gray-700">
                            Reduced calorie intake by 15%
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Zap className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-gray-700">
                            Increased protein intake by 20%
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Zap className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-gray-700">
                            On track to reach goal in 6 weeks
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Join thousands of satisfied users who have transformed their
              health journey with NutriTracker.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Sarah J.",
                role: "Fitness Enthusiast",
                quote:
                  "NutriTracker has completely changed my approach to eating. The detailed breakdown of macros helps me optimize my diet for my training goals.",
              },
              {
                name: "Michael T.",
                role: "Weight Loss Journey",
                quote:
                  "I've lost 30lbs in 4 months by tracking my calories with NutriTracker. The visual charts make it easy to stay on track with my goals.",
              },
              {
                name: "Priya K.",
                role: "Nutritionist",
                quote:
                  "I recommend NutriTracker to all my clients. It's intuitive, accurate, and helps them build sustainable eating habits for long-term success.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-gray-700">
                  `{testimonial.quote}`
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-blue-100">
              Join thousands of users who have already improved their health
              with NutriTracker.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/register">
                <Button className="mx-2 px-8 py-3 text-base font-medium rounded-lg shadow-lg bg-white text-blue-700 hover:bg-gray-50 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
