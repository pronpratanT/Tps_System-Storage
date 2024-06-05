import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Vendor from "../../../../../models/vendor";

export async function PUT(request, {params}){
    const {id} = params;
    const {newVendorId: vendorId, newVendorName: vendorName} = await request.json();
    await connectMongoDB();
    await Vendor.findByIdAndUpdate(id, {vendorId, vendorName});
    return NextResponse.json({message: "Vendor updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const vendor = await Vendor.findOne({_id: id});
    return NextResponse.json({vendor}, {status: 200});
}