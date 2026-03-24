"use client";

import { CloudFog } from "lucide-react";
import React, { useEffect, useState } from "react";

type Plan = {
  flat_type: string;
  subscription_fees: number;
};

const Subscriptions = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [flatType, setFlatType] = useState<string>("1BHK");
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/subscription-plans`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    console.log("plans data :",data.plans);
    setPlans(data.plans || []);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/flats/subscription`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription_fees: amount,
          flat_type: flatType,
        }),
      }
    );

    await fetchPlans();
    setAmount(0);
    setLoading(false);
  };

  return (
    <div className="p-8 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold">Subscription Plans</h1>

        {/* CURRENT PLANS */}
        <div className="grid grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.flat_type}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <p className="text-zinc-400 text-sm">{p.flat_type}</p>
              <h2 className="text-2xl font-bold mt-1">
                ₹{p.subscription_fees}
              </h2>
            </div>
          ))}
        </div>

        {/* UPDATE FORM */}
        <form
          onSubmit={onSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 max-w-md"
        >
          <h2 className="text-lg font-semibold">Update Plan Pricing</h2>

          <div>
            <label className="text-sm text-zinc-400">Flat Type</label>
            <select
              value={flatType}
              onChange={(e) => setFlatType(e.target.value)}
              className="w-full bg-zinc-800 px-3 py-2 rounded mt-1"
            >
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">New Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-800 px-3 py-2 rounded mt-1"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded"
          >
            {loading ? "Updating..." : "Update Plan"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Subscriptions;