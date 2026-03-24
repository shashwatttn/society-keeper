"use client";
import React, { useEffect, useState } from "react";

const PayNow = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.token
      : null;

  const fetchDue = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resident/current-due`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    fetchDue();
  }, []);

  const handlePayment = async () => {
    setPaying(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resident/pay-now`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const result = await res.json();

    if (res.ok) {
      fetchDue();
    } else {
      alert(result.message);
    }

    setPaying(false);
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  return (
    <div className="p-10 text-white bg-zinc-950 min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-[380px] space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Maintenance</h1>
          <p className="text-zinc-500 text-sm">{currentMonth}</p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 text-center">
          <p className="text-zinc-400 text-xs">Total Payable</p>
          <h2 className="text-4xl font-bold mt-1">₹{data.amount}</h2>
        </div>

        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-500">Flat</span>
            <span>{data.flat_no}</span>
          </div>
        </div>

        {data.isPaid ? (
          <div className="bg-emerald-500/20 text-emerald-400 text-center py-3 rounded-xl font-semibold">
            PAID FOR THIS MONTH ✅
          </div>
        ) : (
          <>
            <p className="text-xs text-rose-400 text-center">
              Due before {new Date(data.due_date).toLocaleDateString()}
            </p>

            <button
              onClick={handlePayment}
              disabled={paying}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl"
            >
              {paying ? "Processing..." : "PAY NOW"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PayNow;
