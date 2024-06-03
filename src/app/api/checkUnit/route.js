import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Unit from "../../../../models/unit";

export async function POST(req){
    try{
        await connectMongoDB();
        const {unitid} = await req.json();
        const unit = await Unit.findOne({unitid}).select("_id");
        console.log("Unit: ", unit);


        return NextResponse.json({unit});
        
    } catch(error){
        console.log(error);
    }
}