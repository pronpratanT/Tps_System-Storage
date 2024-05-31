"use client"

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { data: session } = useSession();
    if (session) router.replace("/welcome");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, password, redirect: false
            })

            if (res.error) {
                setError("Invalid credentials");
                return;
            }
            router.replace("welcome");

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-8 rounded-lg border-t-4 border-[#8146FF] w-[450px]">
                <h1 className="text-2xl font-bold my-4 text-center">Sign in to your account</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    <button className="bg-[#8146FF] text-white font-bold cursor-pointer px-6 py-3 rounded-md" type='submit'>
                        Sign in
                    </button>
                    {error &&(
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                        </div>
                    )}
                    

                    <Link className="text-sm mt-3 text-right" href={'/register'}>
                        Don't have an account? <span className="underline text-[#8146FF]">Sign Up</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
