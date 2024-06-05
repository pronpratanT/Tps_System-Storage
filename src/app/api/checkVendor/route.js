import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Vendor from "../../../../models/vendor";

export async function POST(request){
    try{
        await connectMongoDB();
        const {vendorId} = await request.json();
        const vendor = await Vendor.findOne({vendorId}).select("_id");

        return NextResponse.json({vendor});
    }catch(error){
        console.log(error);
    }
}