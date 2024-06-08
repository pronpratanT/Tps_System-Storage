import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Product from "../../../../models/product";

export async function POST(request) {
  const { productId, productName, productUnit, storeHouse, amount } = await request.json();
  await connectMongoDB();
  await Product.create({ productId, productName, productUnit, storeHouse, amount });
  return NextResponse.json({ message: "Product Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" }, { status: 200 });
}
