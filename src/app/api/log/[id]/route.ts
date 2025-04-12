import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Update a food log (quantity)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const { quantity } = await request.json();

    // Validate input
    if (quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Check if the log exists and belongs to the user
    const log = await prisma.foodLog.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!log) {
      return NextResponse.json(
        { message: "Food log not found" },
        { status: 404 }
      );
    }

    if (log.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized to update this food log" },
        { status: 403 }
      );
    }

    // Update the food log
    const updatedLog = await prisma.foodLog.update({
      where: { id },
      data: { quantity },
      include: { food: true },
    });

    return NextResponse.json({
      foodLog: updatedLog,
      message: "Food log updated successfully",
    });
  } catch (error) {
    console.error("Error updating food log:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the food log" },
      { status: 500 }
    );
  }
}

// Delete a food log
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    // Check if the log exists and belongs to the user
    const log = await prisma.foodLog.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!log) {
      return NextResponse.json(
        { message: "Food log not found" },
        { status: 404 }
      );
    }

    if (log.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized to delete this food log" },
        { status: 403 }
      );
    }

    // Delete the food log
    await prisma.foodLog.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Food log deleted successfully" });
  } catch (error) {
    console.error("Error deleting food log:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the food log" },
      { status: 500 }
    );
  }
}
