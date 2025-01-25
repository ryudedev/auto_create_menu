import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { id, name } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ message: "id and name are required", status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found", status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
