import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs'

export async function POST(req){
    try{
        const{userid, name, email, password, role} = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        // await User.create({userid, name, email, password: hashedPassword, role});
        await User.create({userid, name, email, password, role});

        return NextResponse.json({message: "User registered."}, {status: 201});

    } catch(error){
        return NextResponse.json({message: "An error occured while registrating the user."},{status:500})
    }
}