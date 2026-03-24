"use client";
import React, { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RecordPayment() {
  const [flatNo, setFlatNo] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [billingMonth, setBillingMonth] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flatNo || !amountPaid || !billingMonth) {
      alert("Fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const monthNumber = MONTHS.indexOf(billingMonth) + 1;

      const payload = {
        flat_no: flatNo.trim().toUpperCase(),
        amount_paid: Number(amountPaid),
        month: monthNumber,
        mode_of_payment: paymentMode,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/add-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("✅ Payment recorded");

        setFlatNo("");
        setAmountPaid("");
        setBillingMonth("");
        setPaymentMode("upi");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 m-4 border border-white/10 bg-zinc-950 rounded-2xl p-8 text-white min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Record Payment</h1>
        <p className="text-zinc-500 text-sm">
          Log manual maintenance collection
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Flat */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500">Flat Number</label>
          <input
            value={flatNo}
            onChange={(e) => setFlatNo(e.target.value)}
            placeholder="A-101"
            className="bg-zinc-900 px-4 py-3 rounded-xl"
            required
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500">Amount</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="bg-zinc-900 px-4 py-3 rounded-xl"
            required
          />
        </div>

        {/* Month */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500">Billing Month</label>
          <select
            value={billingMonth}
            onChange={(e) => setBillingMonth(e.target.value)}
            className="bg-zinc-900 px-4 py-3 rounded-xl"
            required
          >
            <option value="">Select Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-500">Payment Mode</label>

          <div className="flex gap-4">
            {["CASH", "UPI", "BANK_TRANSFER"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold ${
                  paymentMode === mode
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                {mode.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            disabled={isSubmitting}
            className="px-10 py-3 bg-white text-black rounded-xl font-bold"
          >
            {isSubmitting ? "Recording..." : "Confirm Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
