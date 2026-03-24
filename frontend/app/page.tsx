import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-14 text-center max-w-2xl w-full">

        <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight">
          Society Keeper
        </h1>

        <p className="text-xl text-slate-300 mb-12">
          Smart and effortless society management for residents and admins.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">

          <Link
            href="/sign-in"
            className="px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition duration-300 shadow-lg hover:scale-105"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="px-10 py-4 rounded-xl border border-slate-400 text-slate-200 hover:bg-white hover:text-slate-900 font-semibold text-lg transition duration-300 hover:scale-105"
          >
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Home;