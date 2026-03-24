"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFlat() {
  const params = useParams();
  const router = useRouter();

  const flatId = Array.isArray(params.flat_id)
    ? params.flat_id[0]
    : params.flat_id;

  const [flatNumber, setFlatNumber] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentEmail, setResidentEmail] = useState("");
  const [subscriptionId, setSubscriptionId] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.token
      : null;

  const fetchFlatDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/flats/${flatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      const flat = data?.data;

      if (!flat) {
        alert("Flat not found");
        router.push("/admin/flats");
        return;
      }

      setFlatNumber(flat.flat_no || "");
      setResidentName(flat.full_name || "");
      setResidentEmail(flat.email || "");
      setSubscriptionId(flat.subscription_id);

    } catch (err) {
      console.log(err);
      alert("Failed to load flat");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatId) fetchFlatDetails();
  }, [flatId]);

  const handleUpdateFlat = async () => {
    try {
      setIsUpdating(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/update-flat`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flat_id: flatId,
            flat_no: flatNumber,
            full_name: residentName,
            email: residentEmail,
            subscription_id: subscriptionId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      alert("Flat updated ✅");
      router.push("/admin/flats");

    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading flat details...
      </div>
    );

  return (
    <div className="p-10 text-white bg-zinc-950 min-h-screen">
      <div className="max-w-xl space-y-5">

        <h1 className="text-3xl font-bold">Edit Flat</h1>

        <input
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          placeholder="Flat Number"
          className="w-full bg-zinc-800 px-4 py-3 rounded-xl outline-none"
        />

        <input
          value={residentName}
          onChange={(e) => setResidentName(e.target.value)}
          placeholder="Resident Name"
          className="w-full bg-zinc-800 px-4 py-3 rounded-xl outline-none"
        />

        <input
          value={residentEmail}
          onChange={(e) => setResidentEmail(e.target.value)}
          placeholder="Resident Email"
          className="w-full bg-zinc-800 px-4 py-3 rounded-xl outline-none"
        />

        <select
          value={subscriptionId}
          onChange={(e) => setSubscriptionId(Number(e.target.value))}
          className="w-full bg-zinc-800 px-4 py-3 rounded-xl outline-none"
        >
          <option value={1}>1 BHK</option>
          <option value={2}>2 BHK</option>
          <option value={3}>3 BHK</option>
        </select>

        <button
          disabled={isUpdating}
          onClick={handleUpdateFlat}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-xl"
        >
          {isUpdating ? "Updating..." : "Update Flat"}
        </button>

      </div>
    </div>
  );
}