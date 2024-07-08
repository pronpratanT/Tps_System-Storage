import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(request){
    try{
        await connectMongoDB();
        const {userid} = await request.json();
        const idUser = await User.findOne({userid}).select("_id");

        return NextResponse.json({idUser});
    }catch(error){
        console.log(error);
    }
}