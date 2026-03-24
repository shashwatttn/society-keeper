"use client";
import React, { useState } from "react";

const AddFlat = () => {
  const [flatNo, setFlatNo] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [flatType, setFlatType] = useState("1BHK");
  const [loading, setLoading] = useState(false);

  const handleAddFlat = async () => {
    if (!flatNo || !fullName || !email || !flatType) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/add-flat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flat_no: flatNo,
            full_name: fullName,
            email,
            flat_type: flatType,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add flat");
        return;
      }

      alert("Flat Added Successfully ✅");

      setFlatNo("");
      setFullName("");
      setEmail("");
      setFlatType("1BHK");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 m-4 p-8 bg-zinc-950 text-white rounded-2xl">
      <div className="max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Add New Flat</h1>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          {/* Flat Number */}
          <div>
            <label className="text-xs text-zinc-400">Flat Number</label>
            <input
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
              placeholder="A-402"
            />
          </div>

          {/* Resident Name */}
          <div>
            <label className="text-xs text-zinc-400">Resident Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
              placeholder="Shashwat Singh"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-zinc-400">Resident Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
              placeholder="resident@mail.com"
            />
          </div>

          {/* Flat Type */}
          <div>
            <label className="text-xs text-zinc-400">Flat Type</label>
            <select
              value={flatType}
              onChange={(e) => setFlatType(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
            >
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleAddFlat}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded"
          >
            {loading ? "Adding..." : "Add Flat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlat;
