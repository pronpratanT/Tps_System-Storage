import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ImportDb from "../../../../models/importDb";

export async function POST(request) {
      const { dateImport, documentId, importVen, importEm, selectedProduct } = await request.json();
      console.log("Received data:", { dateImport, documentId, importVen, importEm, selectedProduct });
      await connectMongoDB();
      await ImportDb.create({dateImport, documentId, importVen, importEm, selectedProduct})
      return NextResponse.json({ message: "Import Created" }, { status: 201 });
  }
  
  export async function GET() {
      await connectMongoDB();
      const imports = await ImportDb.find();
      return NextResponse.json(imports);
  }
  
  export async function DELETE(request) {
      const id = request.nextUrl.searchParams.get("id");
      await ImportDb.findByIdAndDelete(id);
      return NextResponse.json({ message: "Import deleted" }, { status: 200 });
  }