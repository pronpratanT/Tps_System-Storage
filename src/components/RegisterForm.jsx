"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Select, { components } from 'react-select';
import { Check } from "lucide-react";

export default function RegisterForm() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
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
    if ((!name || !email || !password || !confirmPassword || !userId || !role)) {
      setError("Please complete all inputs!");
      return;
    }

    try {
      //---ตรวจสอบ email ซ้ำ---
      //รับค่า POST มาจากไฟล์ checkUser\route.js
      const resCheckUser = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      //นำมาเปรียบเทียบเช็คค่าซ้ำ
      const { user } = await resCheckUser.json();
      if (user) {
        setError("User already exists!");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name,
          email,
          password,
          role,
        }),
      });

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
  };

  const roleOptions = [
    { value: "USER", label: "USER" },
    { value: "MEMBER", label: "MEMBER" },
    { value: "ADMIN", label: "ADMIN" },
  ];

  const CustomOption = ({ children, ...props }) => {
    return (
      <components.Option {...props}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {children}
          {props.isSelected && <Check size={16} className="text-indigo-600" />}
        </div>
      </components.Option>
    );
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-indigo-600 w-[450px]">
        <h1 className="text-2xl font-bold my-4 text-center">
          Create Account
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
            type="text"
            placeholder="User ID"
            onChange={(e) => setName(e.target.value)}
          />
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
          {/* <input
            className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}
          <Select
            options={roleOptions}
            onChange={(option) => setRole(option ? option.value : "")}
            value={roleOptions.find((option) => option.value === role)}
            placeholder="Select Role"
            isClearable={false}
            className="select-container"
            classNamePrefix="select"
            components={{ Option: CustomOption }}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: "rgb(229, 231, 235)", // border-gray-200
                backgroundColor: "rgba(244, 244, 245, 0.4)", // bg-zinc-100/40
                borderRadius: "0.375rem", // rounded-md
                padding: "0.75rem 1.5rem", // py-3 px-6
                "&:hover": {
                  borderColor: "rgb(229, 231, 235)", // คงสีเดิมเมื่อ hover
                },
              }),
              valueContainer: (baseStyles) => ({
                ...baseStyles,
                padding: "0",
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                margin: "0",
                padding: "0",
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                padding: "0",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }),
              option: (baseStyles, { isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isFocused
                  ? "rgba(243, 244, 246, 0.8)"
                  : isSelected
                  ? "rgba(243, 244, 246, 0.5)"
                  : "white",
                color: "black",
                "&:active": {
                  backgroundColor: "rgba(243, 244, 246, 1)",
                },
              }),
            }}
          />

          {/* TODO: Error & Success */}
          {error && (
            <div className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200">
              {success}
            </div>
          )}

          <button
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold cursor-pointer px-6 py-3 rounded-md"
            type="submit"
          >
            Sign Up
          </button>

          <Link className="text-sm mt-3 text-right" href={"/login"}>
            Already have an account?{" "}
            <span className="underline  text-indigo-600 hover:text-indigo-800">
              Sign in
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
}
