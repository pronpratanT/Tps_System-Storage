import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportDb from "../../../../models/exportDb";

export async function POST(request) {
    const { dateExport, documentId, exportVen, exportEm, selectedProduct } = await request.json();
    console.log("Received data:", { dateExport, documentId, exportVen, exportEm, selectedProduct });
    await connectMongoDB();
    await ExportDb.create({dateExport, documentId, exportVen, exportEm, selectedProduct})
    return NextResponse.json({ message: "Export Created" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const exports = await ExportDb.find();
    return NextResponse.json(exports);
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await ExportDb.findByIdAndDelete(id);
    return NextResponse.json({ message: "Export deleted" }, { status: 200 });
}