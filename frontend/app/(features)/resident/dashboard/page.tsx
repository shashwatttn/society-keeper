"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ResidentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      const [payRes, noteRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resident/previous-payments`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resident/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payData = await payRes.json();
      const noteData = await noteRes.json();

      setPayments(payData.result || []);
      setNotifications(noteData.notifications || []);
      setHasPending(noteData.hasPending || false);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchDashboardData(user.token);
  }, [user]);

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex-1 m-4 p-6 md:p-10 text-white flex flex-col gap-10 max-w-5xl mx-auto">
      {/* GREETING */}
      <div>
        <h1 className="text-4xl font-bold">
          Hey, {user?.user?.full_name?.split(" ")[0] || "Resident"}
        </h1>
        {hasPending && (
          <p className="text-amber-400 text-sm mt-1">
            You have pending dues ⚠️
          </p>
        )}
      </div>

      {/* NOTIFICATIONS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Announcements</h2>
          <span className="text-xs text-zinc-500">
            {notifications.length} messages
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {notifications.length ? (
            notifications.map((note) => (
              <div
                key={note.notification_id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{note.title}</h3>

                  {note.target_type === "PENDING" && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      Payment
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-400">{note.message}</p>

                <p className="text-[10px] text-zinc-600 mt-3">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-zinc-600">No announcements yet.</p>
          )}
        </div>
      </section>

      {/* PAYMENTS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
          <Link
            href="/resident/payment-history"
            className="text-amber-500 text-xs font-semibold"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {payments.length ? (
            payments.slice(0, 2).map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
              >
                <div>
                  <p className="font-medium">Maintenance Fee</p>
                  <p className="text-xs text-zinc-500">{p.mode_of_payment}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{p.amount_paid}</p>
                  <p className="text-xs text-emerald-400">
                    {new Date(p.payment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600">No payment activity yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
