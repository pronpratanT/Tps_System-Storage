import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ImportDb from "../../../../models/importDb";

export async function POST(req){
    try{
        await connectMongoDB();
        const {documentId} = await req.json();
        const importDb = await ImportDb.findOne({documentId}).select("_id");

        return NextResponse.json({importDb});
        
    } catch(error){
        console.log(error);
    }
}