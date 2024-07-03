import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportDb from "../../../../models/exportDb";

export async function PUT(request, {params}){
    const {id} = params;
    const { newDateExport: dateExport, newDocumentId: documentId, newExportVen: exportVen, newExportEm: exportEm, newSelectedProduct: selectedProduct } = await request.json();
    await connectMongoDB();
    await ExportDb.findByIdAndUpdate(id, {dateExport, documentId, exportVen, exportEm, selectedProduct});
    return NextResponse.json({message: "Export updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const exportDb = await ExportDb.findOne({_id: id});
    return NextResponse.json({exportDb}, {status: 200});
}