import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ImportPD from "../../../../models/import";

export async function POST(request) {
    const { dateImport, documentId, importVen, importEm } = await request.json();
    await connectMongoDB();
    await ImportPD.create({ dateImport, documentId, importVen, importEm });
    return NextResponse.json({ message: "Import Created" }, { status: 201 });
  }
  
  export async function GET() {
    await connectMongoDB();
    const imports = await ImportPD.find();
    return NextResponse.json(imports);
  }
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await ImportPD.findByIdAndDelete(id);
    return NextResponse.json({ message: "Import deleted" }, { status: 200 });
  }
  