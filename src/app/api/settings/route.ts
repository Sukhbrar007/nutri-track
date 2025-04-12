/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get user settings
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        dailyCalorieGoal: true,
        dailyProteinGoal: true,
        dailyCarbGoal: true,
        dailyFatGoal: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ settings: user });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching settings" },
      { status: 500 }
    );
  }
}

// Update user settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { dailyCalorieGoal, dailyProteinGoal, dailyCarbGoal, dailyFatGoal } =
      await request.json();

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyCalorieGoal,
        dailyProteinGoal,
        dailyCarbGoal,
        dailyFatGoal,
      },
      select: {
        dailyCalorieGoal: true,
        dailyProteinGoal: true,
        dailyCarbGoal: true,
        dailyFatGoal: true,
      },
    });

    return NextResponse.json({
      settings: updatedUser,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { message: "An error occurred while updating settings" },
      { status: 500 }
    );
  }
}
