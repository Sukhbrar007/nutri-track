/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import FoodItem from "./FoodItem";
import FoodForm from "./FoodForm";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodLog {
  id: string;
  quantity: number;
  food: Food;
}

interface FoodListProps {
  foodLogs: FoodLog[];
  date: string;
  onUpdate: () => void;
}

export default function FoodList({ foodLogs, date, onUpdate }: FoodListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<FoodLog[]>(foodLogs);
  const [sortBy, setSortBy] = useState<
    "name" | "calories" | "protein" | "carbs" | "fat"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calculated nutrition totals
  const totals = {
    calories: filteredLogs.reduce(
      (sum, item) => sum + item.food.calories * item.quantity,
      0
    ),
    protein: filteredLogs.reduce(
      (sum, item) => sum + item.food.protein * item.quantity,
      0
    ),
    carbs: filteredLogs.reduce(
      (sum, item) => sum + item.food.carbs * item.quantity,
      0
    ),
    fat: filteredLogs.reduce(
      (sum, item) => sum + item.food.fat * item.quantity,
      0
    ),
  };

  useEffect(() => {
    // Filter and sort food logs
    let result = [...foodLogs];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) =>
        item.food.name.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === "name") {
        valA = a.food.name.toLowerCase();
        valB = b.food.name.toLowerCase();
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        valA =
          sortBy === "calories"
            ? a.food.calories
            : sortBy === "protein"
            ? a.food.protein
            : sortBy === "carbs"
            ? a.food.carbs
            : a.food.fat;

        valB =
          sortBy === "calories"
            ? b.food.calories
            : sortBy === "protein"
            ? b.food.protein
            : sortBy === "carbs"
            ? b.food.carbs
            : b.food.fat;

        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
    });

    setFilteredLogs(result);
  }, [foodLogs, searchTerm, sortBy, sortDirection]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/log/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete food log");
      }

      onUpdate();
    } catch (error) {
      console.error("Error deleting food log:", error);
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/log/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      onUpdate();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Function to toggle sort direction or change sort field
  const toggleSort = (
    field: "name" | "calories" | "protein" | "carbs" | "fat"
  ) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with date and actions */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Food Log</h2>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <Button
            onClick={() => setFilterVisible(!filterVisible)}
            variant="outline"
            className="flex items-center"
            size="sm"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Food
          </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div
        className={`px-6 py-3 border-b border-gray-100 bg-gray-50 ${
          filterVisible ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              className="border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={sortBy}
              onChange={(e) => toggleSort(e.target.value as any)}
            >
              <option value="name">Sort by: Name</option>
              <option value="calories">Sort by: Calories</option>
              <option value="protein">Sort by: Protein</option>
              <option value="carbs">Sort by: Carbs</option>
              <option value="fat">Sort by: Fat</option>
            </select>

            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="border border-gray-200 rounded-lg py-2 px-3 focus:outline-none hover:bg-gray-50 text-sm"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-3 justify-between bg-indigo-50">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span className="text-xs font-medium text-gray-600">Calories: </span>
          <span className="text-xs font-bold ml-1 text-gray-800">
            {totals.calories}
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-xs font-medium text-gray-600">Protein: </span>
          <span className="text-xs font-bold ml-1 text-gray-800">
            {totals.protein.toFixed(1)}g
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span className="text-xs font-medium text-gray-600">Carbs: </span>
          <span className="text-xs font-bold ml-1 text-gray-800">
            {totals.carbs.toFixed(1)}g
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs font-medium text-gray-600">Fat: </span>
          <span className="text-xs font-bold ml-1 text-gray-800">
            {totals.fat.toFixed(1)}g
          </span>
        </div>
      </div>

      {/* Food items list */}
      <div className="divide-y divide-gray-100">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-6">
              No food items added for this day.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="outline"
              className="mx-auto"
            >
              Add Your First Food Item
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((foodLog) => (
              <FoodItem
                key={foodLog.id}
                foodLog={foodLog}
                onDelete={handleDelete}
                onUpdate={onUpdate}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Food Item"
      >
        <FoodForm
          date={date}
          onSuccess={() => {
            setIsAddModalOpen(false);
            onUpdate();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
