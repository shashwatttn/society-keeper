"use client";

import React, { useEffect, useState } from "react";

type RecordRow = {
  monthly_record_id: number;
  flat_no: string;
  full_name: string | null;
  email: string | null;
  flat_type: string;
  subscription_fees: number;
  due_date: string;
  status: string;
};

export default function MonthlyRecords() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.token
      : null;

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/monthly-records?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setRecords(data.result || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Monthly Records</h1>
          <p className="text-zinc-500 text-sm">
            View monthwise billing status of all flats
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-end">

          {/* MONTH */}
          <div>
            <label className="text-xs text-zinc-400">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="block mt-1 bg-zinc-800 px-3 py-2 rounded"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* YEAR */}
          <div>
            <label className="text-xs text-zinc-400">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="block mt-1 bg-zinc-800 px-3 py-2 rounded w-28"
            />
          </div>

          <button
            onClick={fetchRecords}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-semibold"
          >
            Fetch
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-zinc-800 text-zinc-300 text-sm">
              <tr>
                <th className="p-3">Flat</th>
                <th className="p-3">Resident</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-400">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">
                    No records found
                  </td>
                </tr>
              )}

              {!loading &&
                records.map((r) => (
                  <tr
                    key={r.monthly_record_id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/40"
                  >
                    <td className="p-3 font-semibold">{r.flat_no}</td>

                    <td className="p-3">
                      {r.full_name || (
                        <span className="text-zinc-500 italic">
                          Vacant
                        </span>
                      )}
                    </td>

                    <td className="p-3">{r.flat_type}</td>

                    <td className="p-3 font-semibold">
                      ₹{r.subscription_fees}
                    </td>

                    <td className="p-3">
                      {new Date(r.due_date).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === "PAID"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}