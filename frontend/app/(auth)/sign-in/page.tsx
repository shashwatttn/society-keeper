"use client";
import React from "react";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

const SignIn = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <AuthForm type="sign-in" />
    </div>
  )
}

export default SignIn