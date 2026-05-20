import { NextResponse } from "next/server";

const mockProducts = [
  {
    id: "1",
    name: "Golden Royale Necklace",
    slug: "golden-royale-necklace",
    price: 12500,
    category: "jewelry",
  },
  {
    id: "2",
    name: "Emperor Gold Ring",
    slug: "emperor-gold-ring",
    price: 8900,
    category: "jewelry",
  },
];

export async function GET() {
  return NextResponse.json({ products: mockProducts }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Product created successfully", product: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
