import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Product from "../../../../../models/product";

export async function PUT(request, {params}){
    const {id} = params;
    const { newProductId: productId, newProductName: productName, newProductUnit: productUnit, newStoreHouse: storeHouse, newAmount: amount } = await request.json();
    await connectMongoDB();
    await Product.findByIdAndUpdate(id, {productId, productName, productUnit, storeHouse, amount});
    return NextResponse.json({message: "Product updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = params;
    await connectMongoDB();
    const product = await Product.findOne({_id: id});
    return NextResponse.json({product}, {status: 200});
}