"use client"

import React, { useState } from 'react'
import Navbar from './Navbar'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { data: session } = useSession();
    if (session) redirect("/welcome");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError("Password do not match!");
            return;
        }
        if (!name || !email || !password || !confirmPassword) {
            setError("Please complete all inputs!");
            return;
        }

        try {
            //---ตรวจสอบ email ซ้ำ---
            //รับค่า POST มาจากไฟล์ checkUser\route.js
            const resCheckUser = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/checkUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
            //นำมาเปรียบเทียบเช็คค่าซ้ำ
            const { user } = await resCheckUser.json();
            if (user) {
                setError("User already exists!");
                return;
            }

            const res = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })

            if (res.ok) {
                const form = e.target;
                setError("");
                setSuccess("User registration successfully!");
                form.reset();
            } else {
                console.log("User registration failed.");
            }

        } catch (error) {
            console.log("Error during registration: ", error);
        }
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-8 rounded-lg border-t-4 border-indigo-800 w-[450px]">
                <h1 className="text-2xl font-bold my-4 text-center">Create your account</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Full Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* TODO: Error & Success */}
                    {error &&(
                        <div className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200">
                        {error}
                    </div>
                    )}
                    {success &&(
                        <div className="px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200">
                        {success}
                    </div>
                    )}
                    
                    <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold cursor-pointer px-6 py-3 rounded-md" type='submit'>
                        Sign Up
                    </button>

                    <Link className="text-sm mt-3 text-right" href={'/login'}>
                        Already have an account? <span className="underline  text-indigo-600 hover:text-indigo-800">Sign in</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
