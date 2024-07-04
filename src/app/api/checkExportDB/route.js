import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ExportDb from "../../../../models/exportDb";

export async function POST(req){
    try{
        await connectMongoDB();
        const {documentId} = await req.json();
        const exportDb = await ExportDb.findOne({documentId}).select("_id");

        return NextResponse.json({exportDb});
        
    } catch(error){
        console.log(error);
    }
}