"use client";
import React, { useState, useEffect } from "react";

type EditField = "name" | "password" | null;

const ResidentProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState<EditField>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.user?.full_name || "");
    }
  }, []);

  const discard = () => {
    setEditing(null);
    setPassword("");
    setName(user?.user?.full_name || "");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            user_id: user?.user?.user_id,
            full_name: editing === "name" ? name : "",
            password: editing === "password" ? password : "",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      const updated = { ...user, user: data.result };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);

      discard();
    } catch (err) {
      console.log(err);
    }
  };

  const card =
    "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center";
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your profile information and security
          </p>
        </div>

        {/* EMAIL */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
              Email Address
            </p>
            <p className="text-lg font-medium text-zinc-200">
              {user?.user?.email}
            </p>
          </div>

          <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">
            Read Only
          </span>
        </div>

        {/* NAME */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg flex justify-between items-center">
          <div className="w-full max-w-sm">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
              Full Name
            </p>

            {editing === "name" ? (
              <input
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-400 px-3 py-2 rounded-lg outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <p className="text-lg font-medium text-zinc-200">
                {user?.user?.full_name}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            {editing === "name" && (
              <button
                onClick={discard}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition"
              >
                Discard
              </button>
            )}

            <button
              onClick={() =>
                editing === "name" ? handleUpdate() : setEditing("name")
              }
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition"
            >
              {editing === "name" ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg flex justify-between items-center">
          <div className="w-full max-w-sm">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
              Password
            </p>

            {editing === "password" ? (
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 px-3 py-2 rounded-lg outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <p className="text-lg tracking-widest text-zinc-300">••••••••</p>
            )}
          </div>

          <div className="flex gap-3">
            {editing === "password" && (
              <button
                onClick={discard}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition"
              >
                Discard
              </button>
            )}

            <button
              onClick={() =>
                editing === "password" ? handleUpdate() : setEditing("password")
              }
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition"
            >
              {editing === "password" ? "Save" : "Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
