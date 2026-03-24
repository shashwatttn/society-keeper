"use client";
import React, { useState, useEffect } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const stored = localStorage.getItem("user");
        const token = stored ? JSON.parse(stored).token : null;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resident/previous-payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await res.json();
        setPayments(data.result || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);

  return (
    <div className="flex-1 m-4 p-4 md:p-8 text-white flex flex-col gap-10">
      
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-zinc-500 text-sm">A summary of your maintenance contributions.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Total Balance Paid</p>
          <p className="text-4xl font-light text-amber-500">₹{totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col w-full">
        {isLoading ? (
          <p className="text-zinc-600 animate-pulse">Loading history...</p>
        ) : payments.length === 0 ? (
          <p className="text-zinc-600">No transactions recorded yet.</p>
        ) : (
          <div className="flex flex-col">
            {payments.map((p) => (
              <div 
                key={p.payment_id} 
                className="flex items-center py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-2"
              >
               
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-6 shrink-0" />
                
                <div className="flex-1">
                  <p className="text-lg font-medium text-zinc-200">
                    {new Date(p.payment_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono tracking-tighter uppercase">
                    {p.mode_of_payment} • REF-{p.payment_id}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-semibold">₹{p.amount_paid.toLocaleString()}</p>
                  <p className="text-[10px] uppercase text-zinc-500 tracking-widest">Success</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;