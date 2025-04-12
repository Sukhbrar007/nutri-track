"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

interface FoodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  date?: string;
  initialData?: {
    id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isEditing?: boolean;
}

export default function FoodForm({
  onSuccess,
  onCancel,
  date,
  initialData,
  isEditing = false,
}: FoodFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    calories: initialData?.calories || 0,
    protein: initialData?.protein || 0,
    carbs: initialData?.carbs || 0,
    fat: initialData?.fat || 0,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Convert numeric fields to numbers
    if (name !== "name") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // If editing, update existing food
      if (isEditing && initialData?.id) {
        await fetch(`/api/food/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }
      // If adding with a date, create food and log it on the same date
      else if (date) {
        await fetch("/api/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            date,
          }),
        });
      }
      // Just create the food without logging
      else {
        await fetch("/api/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting food:", error);
      setError("Failed to save food item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Food Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="calories"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Calories
          </label>
          <input
            id="calories"
            name="calories"
            type="number"
            min="0"
            step="1"
            value={formData.calories}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="protein"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Protein (g)
          </label>
          <input
            id="protein"
            name="protein"
            type="number"
            min="0"
            step="0.1"
            value={formData.protein}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="carbs"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Carbs (g)
          </label>
          <input
            id="carbs"
            name="carbs"
            type="number"
            min="0"
            step="0.1"
            value={formData.carbs}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="fat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fat (g)
          </label>
          <input
            id="fat"
            name="fat"
            type="number"
            min="0"
            step="0.1"
            value={formData.fat}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Update" : "Add"} Food
        </Button>
      </div>
    </form>
  );
}
