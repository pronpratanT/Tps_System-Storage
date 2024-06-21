"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session } = getSession();

  useEffect(() => {
    if (session) {
      router.replace("/welcome");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid credentials");
        return;
      }
      router.replace("/welcome");
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-indigo-600 w-[450px]">
        <h1 className="text-2xl font-bold my-4 text-center">
          Sign in to your account
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
            type="email"
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear error on change
            }}
          />
          <input
            className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
            type="password"
            aria-label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error on change
            }}
          />
          {error && (
            <div className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200">
              {error}
            </div>
          )}

          <button
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold cursor-pointer px-6 py-3 rounded-md"
            type="submit"
          >
            Sign in
          </button>

          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Don&apos;t have an account?{" "}
            <span className="underline text-indigo-600 hover:text-indigo-800">Sign Up</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
