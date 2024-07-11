import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { newUserId: userid, newName: name, newEmail: email, newPassword: password, newRole: role } = await request.json();

        await connectMongoDB();

        // สร้างออบเจ็กต์สำหรับข้อมูลที่จะอัปเดต
        const updateData = { userid, name, email, role };

        // ถ้ามีการส่งรหัสผ่านใหม่มา ให้เข้ารหัสและเพิ่มเข้าไปใน updateData
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // อัปเดตข้อมูลผู้ใช้
        await User.findByIdAndUpdate(id, updateData);

        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const user = await User.findOne({_id: id});
    return NextResponse.json({user}, {status: 200});
}