import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get user's nutrition goals
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        dailyCalorieGoal: true,
        dailyProteinGoal: true,
        dailyCarbGoal: true,
        dailyFatGoal: true,
      },
    });

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    console.log(
      `Querying logs from ${startDate.toISOString()} to ${endDate.toISOString()}`
    );

    // Get food logs for the date range
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
    });

    console.log(`Found ${foodLogs.length} food logs`);

    // Group logs by date and calculate totals
    const dailySummaries = foodLogs.reduce((acc, log) => {
      // Use client-friendly date format (YYYY-MM-DD)
      const dateStr = log.date.toISOString().split("T")[0];

      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      acc[dateStr].calories += log.food.calories * log.quantity;
      acc[dateStr].protein += log.food.protein * log.quantity;
      acc[dateStr].carbs += log.food.carbs * log.quantity;
      acc[dateStr].fat += log.food.fat * log.quantity;

      return acc;
    }, {} as Record<string, { date: string; calories: number; protein: number; carbs: number; fat: number }>);

    // Convert to array
    const dailyData = Object.values(dailySummaries);

    // Calculate today's summary explicitly
    const today = new Date().toISOString().split("T")[0];
    console.log(`Today's date for summary: ${today}`);

    const todaySummary = dailySummaries[today] || {
      date: today,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    console.log(`Today's summary:`, todaySummary);

    return NextResponse.json({
      goals: {
        calories: user?.dailyCalorieGoal,
        protein: user?.dailyProteinGoal,
        carbs: user?.dailyCarbGoal,
        fat: user?.dailyFatGoal,
      },
      todaySummary,
      dailyData,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching summary data" },
      { status: 500 }
    );
  }
}
