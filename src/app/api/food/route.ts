/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Create a food item (optionally log it if date is provided)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, calories, protein, carbs, fat, date } = await request.json();

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

    // Create the food item
    const food = await prisma.food.create({
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
      },
    });

    // If date is provided, create a food log
    if (date) {
      await prisma.foodLog.create({
        data: {
          userId: session.user.id,
          foodId: food.id,
          date: new Date(date),
          quantity: 1,
        },
      });
    }

    return NextResponse.json(
      { food, message: "Food item created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating food:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the food item" },
      { status: 500 }
    );
  }
}

// Get all food items
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const foods = await prisma.food.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ foods });
  } catch (error) {
    console.error("Error fetching foods:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching food items" },
      { status: 500 }
    );
  }
}
