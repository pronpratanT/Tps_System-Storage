import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Unit from "../../../../models/unit";

export async function POST(req){
    try{
        const{unitid, unitname} = await req.json;

        await connectMongoDB();
        await Unit.create({unitid, unitname});

        console.log("UnitID: ", unitid);
        console.log("UnitName: ", unitname);

        return NextResponse.json({message: "Unit Add success."}, {status: 201});
    } catch(error){
        return NextResponse.json({message: "An error occured while Add Unit."}, {status:500})
    }
}