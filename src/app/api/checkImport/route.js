import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ImportPD from "../../../../models/import";

export async function POST(req){
    try{
        await connectMongoDB();
        const {documentId} = await req.json();
        const importPd = await ImportPD.findOne({documentId}).select("_id");

        return NextResponse.json({importPd});
        
    } catch(error){
        console.log(error);
    }
}