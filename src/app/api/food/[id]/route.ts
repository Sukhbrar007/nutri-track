import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Update a food item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const { name, calories, protein, carbs, fat } = await request.json();

    // Validate input
    if (
      !name ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fat === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the food item
    const updatedFood = await prisma.food.update({
      where: { id },
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
      },
    });

    return NextResponse.json({
      food: updatedFood,
      message: "Food item updated successfully",
    });
  } catch (error) {
    console.error("Error updating food:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the food item" },
      { status: 500 }
    );
  }
}

// Delete a food item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete food items
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized to delete food items" },
        { status: 403 }
      );
    }

    const id = (await params).id;

    // Check if the food item exists
    const food = await prisma.food.findUnique({
      where: { id },
      include: { foodLogs: true },
    });

    if (!food) {
      return NextResponse.json(
        { message: "Food item not found" },
        { status: 404 }
      );
    }

    // Check if there are any logs referencing this food
    if (food.foodLogs.length > 0) {
      return NextResponse.json(
        {
          message: "Cannot delete food item that is being used in logs",
          count: food.foodLogs.length,
        },
        { status: 400 }
      );
    }

    // Delete the food item
    await prisma.food.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the food item" },
      { status: 500 }
    );
  }
}
