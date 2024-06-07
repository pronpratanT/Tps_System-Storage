import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Unit from "../../../../models/unit";

export async function POST(req){
    try{
        await connectMongoDB();
        const {unitId} = await req.json();
        const unit = await Unit.findOne({unitId}).select("_id");

        return NextResponse.json({unit});
        
    } catch(error){
        console.log(error);
    }
}