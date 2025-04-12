/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import FoodForm from "@/components/food/FoodForm";
import { Edit, Trash, Plus, Search } from "lucide-react";
import { AlertCircle } from "lucide-react";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function FoodDatabase() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    // Filter foods based on search term
    if (searchTerm.trim() === "") {
      setFilteredFoods(foods);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFoods(
        foods.filter((food) => food.name.toLowerCase().includes(term))
      );
    }
  }, [foods, searchTerm]);

  const fetchFoods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/food");

      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }

      const data = await response.json();
      setFoods(data.foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setError("Could not load food database. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setIsEditModalOpen(true);
  };

  const handleDelete = (food: Food) => {
    setSelectedFood(food);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFood) return;

    try {
      const response = await fetch(`/api/food/${selectedFood.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400 && data.count > 0) {
          throw new Error(
            `This food cannot be deleted because it is used in ${data.count} food logs.`
          );
        }
        throw new Error("Failed to delete food");
      }

      // Remove the deleted food from the list
      setFoods((prev) => prev.filter((f) => f.id !== selectedFood.id));
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Error deleting food:", error);
      setDeleteError(error.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Food Database</CardTitle>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Food
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No food items found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protein (g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carbs (g)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fat (g)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFoods.map((food) => (
                    <tr key={food.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {food.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {food.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {food.protein.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {food.carbs.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {food.fat.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(food)}
                          className="text-primary hover:text-primary/80 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Food Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Food"
      >
        <FoodForm
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchFoods();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Food Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Food"
      >
        {selectedFood && (
          <FoodForm
            initialData={selectedFood}
            isEditing={true}
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchFoods();
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Food"
      >
        <div className="py-4">
          {deleteError ? (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start mb-4">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{deleteError}</span>
            </div>
          ) : (
            <p>
              Are you sure you want to delete {selectedFood?.name}? This action
              cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
