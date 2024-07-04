import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportDb from "../../../../models/exportDb";

export async function POST(request) {
    try {
        const { dateExport, documentId, exportVen, exportEm, selectedProduct } = await request.json();
        console.log("Received data:", { dateExport, documentId, exportVen, exportEm, selectedProduct });

        await connectMongoDB();

        const existingExport = await ExportDb.findOne({ documentId });
        if (existingExport) {
            return NextResponse.json(
                { message: "Document ID already exists!" },
                { status: 400 }
            );
        }

        await ExportDb.create({ dateExport, documentId, exportVen, exportEm, selectedProduct });

        return NextResponse.json(
            { message: "Export Created Successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/ExportDB:", error);
        return NextResponse.json(
            { message: "Error creating export", error: error.message },
            { status: 500 }
        );
    }

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