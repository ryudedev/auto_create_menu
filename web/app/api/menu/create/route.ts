import { Category, Menu, Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type MenuData = Menu & { categoryName: string };

export async function POST(req: NextRequest) {
  const domain = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const { name, description, image, categoryId, categoryName }: MenuData = await req.json();

  // nameがなければエラーを返す
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  // categoryIdがあってcategoryNameがあればエラーを返す。
  if (categoryId && categoryName) {
    return NextResponse.json({ error: "categoryId and categoryName are exclusive" }, { status: 400 });
  } else if (!categoryId && !categoryName) {
    return NextResponse.json({ error: "categoryId or categoryName is required" }, { status: 400 });
  }

  try {

    // categoryIdが存在するか確認する
    if (categoryId) {
      const existCategory = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!existCategory) {
        return NextResponse.json({ error: "categoryId not found" }, { status: 400 });
      }
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

    } else if (!categoryId && categoryName) {
      // fetchでカテゴリーを作成する
      const createdCategory: Category = await fetch(`${protocol}://${domain}/api/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: categoryName })
      }).then(res => res.json())

      // categoryIdを作成したカテゴリーのidを元にmenuを作成する
      const menu = await prisma.menu.create({
        data: {
          name,
          description,
          image,
          categoryId: createdCategory.id
        },
      })

      return NextResponse.json(menu);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: "categoryId not found" }, { status: 400 });
      } else {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

}
