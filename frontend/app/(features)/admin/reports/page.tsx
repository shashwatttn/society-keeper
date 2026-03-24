"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportRow = {
  flat_no: string;
  full_name: string;
  due_date: string;
  status: string;
  amount_paid: number;
};

export default function AdminReports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setRows(data.reportRows || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const downloadPDF = () => {
    if (!rows || rows.length === 0) {
      alert("No report data to download");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Society Payment Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Total Collection: ₹${summary?.total_collection ?? 0}`, 14, 22);

    const tableRows = rows.map((r) => [
      r.flat_no ?? "-",
      r.full_name ?? "-",
      r.due_date ? new Date(r.due_date).toLocaleDateString() : "-",
      r.status ?? "-",
      `₹${r.amount_paid ?? 0}`,
    ]);

    autoTable(doc, {
      head: [["Flat", "Resident", "Due Date", "Status", "Amount Paid"]],
      body: tableRows,
      startY: 30,
    });

    doc.save("payment-report.pdf");
  };

  return (
    <div className="p-8 text-white bg-zinc-950 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Payment Reports</h1>

          <button
            onClick={downloadPDF}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-lg font-semibold"
          >
            Download PDF
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex gap-4 items-end">
          <div>
            <label className="text-xs text-zinc-400">Start Date</label>
            <input
              type="date"
              className="block bg-zinc-800 px-3 py-2 rounded mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">End Date</label>
            <input
              type="date"
              className="block bg-zinc-800 px-3 py-2 rounded mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={fetchReports}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold"
          >
            Apply Filter
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-400 text-sm">Total Collection</p>
            <h2 className="text-2xl font-bold">
              ₹{summary?.total_collection || 0}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-400 text-sm">Paid Flats</p>
            <h2 className="text-2xl font-bold">
              {summary?.total_paid_flats || 0}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-zinc-400 text-sm">Pending Flats</p>
            <h2 className="text-2xl font-bold">
              {summary?.total_pending_flats || 0}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-800 text-sm text-zinc-300">
              <tr>
                <th className="p-3">Flat</th>
                <th className="p-3">Resident</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount Paid</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-5">Loading...</td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="border-t border-zinc-800">
                    <td className="p-3">{r.flat_no}</td>
                    <td className="p-3">{r.full_name}</td>
                    <td className="p-3">
                      {new Date(r.due_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          r.status === "PAID"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">₹{r.amount_paid}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
