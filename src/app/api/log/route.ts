import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Create a food log
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { foodId, date, quantity = 1 } = await request.json();

    // Validate input
    if (!foodId || !date) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create food log
    const foodLog = await prisma.foodLog.create({
      data: {
        userId: session.user.id,
        foodId,
        date: new Date(date),
        quantity,
      },
      include: {
        food: true,
      },
    });

    return NextResponse.json(
      { foodLog, message: "Food log created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating food log:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the food log" },
      { status: 500 }
    );
  }
}

// Get food logs for a specific date
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get food logs for the specified date and user
    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        food: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ foodLogs });
  } catch (error) {
    console.error("Error fetching food logs:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching food logs" },
      { status: 500 }
    );
  }
}
