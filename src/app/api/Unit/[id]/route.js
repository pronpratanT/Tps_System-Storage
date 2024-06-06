import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Unit from "../../../../../models/unit";

export async function PUT(request, {params}){
    const {id} = params;
    const {newUnitId: unitId, newUnitName: unitName} = await request.json();
    await connectMongoDB();
    await Unit.findByIdAndUpdate(id, {unitId, unitName});
    return NextResponse.json({message: "Unit updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const unit = await Unit.findOne({_id: id});
    return NextResponse.json({unit}, {status: 200});
}