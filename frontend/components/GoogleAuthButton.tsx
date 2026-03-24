"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function GoogleAuthButton() {

  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {

    try {

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`,
        {
          token: credentialResponse.credential
        }
      );

      const data = res.data;

      console.log("google auth data =>", data);

   
      localStorage.setItem("user", JSON.stringify(data));

      const role = data.user.role?.toLowerCase();

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/resident/dashboard");
      }

    } catch (err) {
      console.log(err);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}