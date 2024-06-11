import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportPD from "../../../../models/export";

export async function POST(req){
    try{
        await connectMongoDB();
        const {documentId} = await req.json();
        const exportPd = await ExportPD.findOne({documentId}).select("_id");

        return NextResponse.json({exportPd});
        
    } catch(error){
        console.log(error);
    }
}