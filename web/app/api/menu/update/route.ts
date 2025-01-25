import { Menu, Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { id, name, description, image, categoryId } = await req.json();

  if (!id || !name || !categoryId) {
    return NextResponse.json({ error: "id, name and categoryId are required" }, { status: 400 });
  }

  try {
    const menu: Menu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        description,
        image,
        categoryId
      },
    })
    return NextResponse.json(menu);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: "categoryId not found" }, { status: 400 });
      } else {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
  }
}
