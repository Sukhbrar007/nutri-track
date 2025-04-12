"use client";

import { useState } from "react";
import { Edit, Trash, Plus, Minus, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import FoodForm from "./FoodForm";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodLogItem {
  id: string;
  quantity: number;
  food: Food;
}

interface FoodItemProps {
  foodLog: FoodLogItem;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onQuantityChange?: (id: string, newQuantity: number) => void;
}

export default function FoodItem({
  foodLog,
  onDelete,
  onUpdate,
  onQuantityChange,
}: FoodItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { id, food, quantity } = foodLog;

  // Calculate total calories
  const totalCalories = food.calories * quantity;

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting food:", error);
    } finally {
      setIsUpdating(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleQuantityChange = async (change: number) => {
    if (!onQuantityChange) return;

    const newQuantity = Math.max(1, quantity + change);

    if (newQuantity !== quantity) {
      await onQuantityChange(id, newQuantity);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{food.name}</h3>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>

          {/* Quantity controls */}
          {onQuantityChange && (
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500 mr-2">Quantity:</span>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <Minus size={16} className="text-gray-500" />
                </button>
                <span className="mx-2 min-w-[24px] text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Macronutrients as text */}
          <div className="mt-3 flex space-x-3 text-xs text-gray-500">
            <span className="text-emerald-500 font-medium">
              P: {(food.protein * quantity).toFixed(1)}g
            </span>
            <span className="text-amber-500 font-medium">
              C: {(food.carbs * quantity).toFixed(1)}g
            </span>
            <span className="text-red-500 font-medium">
              F: {(food.fat * quantity).toFixed(1)}g
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-lg font-semibold text-gray-900">
            {totalCalories}{" "}
            <span className="text-sm font-normal text-gray-500">kcal</span>
          </div>
          <div className="flex space-x-1 mt-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Food Item"
      >
        <FoodForm
          initialData={food}
          isEditing={true}
          onSuccess={() => {
            setIsEditModalOpen(false);
            onUpdate();
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Food Item"
      >
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to delete {food.name}?
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={isUpdating}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detailed Nutrition Modal */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Nutrition Details"
      >
        <div className="py-4">
          <h3 className="font-medium text-xl mb-4 text-gray-900">
            {food.name}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Serving Size</div>
              <div className="text-lg font-semibold">
                {quantity} serving{quantity !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Calories</div>
              <div className="text-lg font-semibold text-blue-600">
                {food.calories * quantity} kcal
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="font-medium">Protein</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {(food.protein * quantity).toFixed(1)} g
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="font-medium">Carbs</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {(food.carbs * quantity).toFixed(1)} g
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-medium">Fat</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {(food.fat * quantity).toFixed(1)} g
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsInfoModalOpen(false)}
            className="mt-6 w-full"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
