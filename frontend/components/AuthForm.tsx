"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";

type AuthFormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: AuthFormType }) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = type === "sign-in" ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data from backend==>", data);
      if (res.ok && data.token) {
        localStorage.setItem("user", await JSON.stringify(data));

        const role = data.user.role?.toLowerCase();
        if (role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/resident/dashboard"); 
        }

        // alert(data.message || "Login successful!");
      }
      // else {

      //   alert(data.message || "Authentication failed. Please try again.");
      // }
    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong. Please check your internet connection.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
      <h1 className="text-5xl font-bold">
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </h1>
      <p className="text-2xl">
        {type === "sign-in" ? "Welcome back!" : "Join us today!"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border-2 border-gray-200 pt-10 pb-10 px-8 rounded-lg shadow-md"
      >
        <input
          className="border border-gray-300 rounded-md p-2 w-72"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border border-gray-300 rounded-md p-2 w-72"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="rounded-md p-2 w-72 bg-blue-600 text-white hover:bg-blue-700 transition"
          type="submit"
        >
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </button>
        <GoogleAuthButton />
        <p className="text-white flex gap-1 justify-center items-center text-sm">
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-amber-500 hover:underline"
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
