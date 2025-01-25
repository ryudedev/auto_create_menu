import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required", status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
