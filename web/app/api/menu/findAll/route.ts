import { Menu, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const menus: Menu[] = await prisma.menu.findMany();
  return NextResponse.json(menus);
}
