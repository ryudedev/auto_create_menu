import { Menu, Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name, description, image, categoryId }: Menu = await req.json();

  // name、categoryIdが存在しなければエラーを返す
  if (!name || !categoryId) {
    return NextResponse.json({ error: "name and categoryId are required" }, { status: 400 });
  }

  try {
    // prismaを使用してmenuを作成する
    const menu = await prisma.menu.create({
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
