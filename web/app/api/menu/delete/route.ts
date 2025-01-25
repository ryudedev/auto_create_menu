import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const res = await prisma.menu.delete({
      where: { id },
    });
    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: "menu not found" }, { status: 400 });
      } else {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
  }
}
