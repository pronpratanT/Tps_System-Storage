import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import ExportPD from "../../../../../models/export";

export async function PUT(request, {params}){
    const {id} = params;
    const { newDateExport: dateExport, newDocumentId: documentId, newExportVen: exportVen, newExportEm: exportEm } = await request.json();
    await connectMongoDB();
    await ExportPD.findByIdAndUpdate(id, {dateExport, documentId, exportVen, exportEm});
    return NextResponse.json({message: "Export updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const exportPD = await ExportPD.findOne({_id: id});
    return NextResponse.json({exportPD}, {status: 200});
}