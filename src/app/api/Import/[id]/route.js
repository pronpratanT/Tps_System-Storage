import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import ImportPD from "../../../../../models/import";

export async function PUT(request, {params}){
    const {id} = params;
    const { newDateImport: dateImport, newDocumentId: documentId, newImportVen: importVen, newImportEm: importEm } = await request.json();
    await connectMongoDB();
    await ImportPD.findByIdAndUpdate(id, {dateImport, documentId, importVen, importEm});
    return NextResponse.json({message: "Import updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const importPD = await ImportPD.findOne({_id: id});
    return NextResponse.json({importPD}, {status: 200});
}