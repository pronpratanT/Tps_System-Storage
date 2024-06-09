import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(request) {
    const { userid, name, email, role } = await request.json();
    await connectMongoDB();
    await User.create({ userid, name, email, role });
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  }
  
  export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json(users);
  }
  
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  }
  