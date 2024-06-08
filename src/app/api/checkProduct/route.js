import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Product from "../../../../models/product";

export async function POST(req){
    try{
        await connectMongoDB();
        const {productId} = await req.json();
        const product = await Product.findOne({productId}).select("_id");

        return NextResponse.json({product});
    }catch(error){
        console.log(error);
    }
}