import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportPD from "../../../../models/export";

export async function POST(request) {
    const { dateExport, documentId, exportVen, exportEm } = await request.json();
    await connectMongoDB();
    await ExportPD.create({ dateExport, documentId, exportVen, exportEm });
    return NextResponse.json({ message: "Export Created" }, { status: 201 });
  }
  
  export async function GET() {
    await connectMongoDB();
    const exports = await ExportPD.find();
    return NextResponse.json(exports);
  }
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await ExportPD.findByIdAndDelete(id);
    return NextResponse.json({ message: "Export deleted" }, { status: 200 });
  }
  