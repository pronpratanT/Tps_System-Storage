import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export async function PUT(request, {params}){
    const {id} = params;
    const { newUserId: userid, newName: name, newEmail: email, newRole: role } = await request.json();
    await connectMongoDB();
    await User.findByIdAndUpdate(id, {userid, name, email, role});
    return NextResponse.json({message: "Product updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const user = await User.findOne({_id: id});
    return NextResponse.json({user}, {status: 200});
}