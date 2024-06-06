import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Unit from "../../../../models/unit";

export async function POST(request) {
  const { unitId, unitName } = await request.json();
  await connectMongoDB();
  await Unit.create({ unitId, unitName });
  return NextResponse.json({ message: "Unit Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const units = await Unit.find();
  return NextResponse.json(units);
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await Unit.findByIdAndDelete(id);
  return NextResponse.json({ message: "Unit deleted" }, { status: 200 });
}
