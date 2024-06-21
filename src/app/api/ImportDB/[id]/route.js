import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import ImportDb from "../../../../../models/importDb";

export async function PUT(request, {params}){
    const {id} = params;
    const { newDateImport: dateImport, newDocumentId: documentId, newImportVen: importVen, newImportEm: importEm, newSelectedProduct: selectedProduct } = await request.json();
    await connectMongoDB();
    await ImportDb.findByIdAndUpdate(id, {dateImport, documentId, importVen, importEm, selectedProduct});
    return NextResponse.json({message: "Import updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const importDb = await ImportDb.findOne({_id: id});
    return NextResponse.json({importDb}, {status: 200});
}