import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Vendor from "../../../../models/vendor";

export async function POST(request) {
  const { productId, productName, productUnit, storeHouse, amount } = await request.json();
  await connectMongoDB();
  await Vendor.create({ productId, productName, productUnit, storeHouse, amount });
  return NextResponse.json({ message: "Vendor Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const vendors = await Vendor.find();
  return NextResponse.json(vendors);
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await Vendor.findByIdAndDelete(id);
  return NextResponse.json({ message: "Vendor deleted" }, { status: 200 });
}
