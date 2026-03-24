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

      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reports`;

      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await fetch(
        `${url}`,
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

  const downloadCSV = () => {
    if (!rows || rows.length === 0) {
      alert("No report data to download");
      return;
    }

    const headers = ["Flat", "Resident", "Due Date", "Status", "Amount Paid"];

    const csvRows = rows.map((r) => [
      r.flat_no ?? "-",
      r.full_name ?? "-",
      r.due_date ? new Date(r.due_date).toLocaleDateString() : "-",
      r.status ?? "-",
      r.amount_paid ?? 0,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payment-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== PAGE HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Payment Reports
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              View society payment collection and pending dues
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadCSV}
              className="px-5 py-2 rounded-xl font-semibold bg-blue-500/90 hover:bg-blue-400 text-black transition hover:scale-105 active:scale-95"
            >
              Download CSV
            </button>

            <button
              onClick={downloadPDF}
              className="px-5 py-2 rounded-xl font-semibold bg-emerald-500/90 hover:bg-emerald-400 text-black transition hover:scale-105 active:scale-95"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* ===== FILTER TOOLBAR ===== */}
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 md:items-end">
          <div>
            <label className="text-xs text-zinc-400">Start Date</label>
            <input
              type="date"
              className="block bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">End Date</label>
            <input
              type="date"
              className="block bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={fetchReports}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl font-semibold transition hover:scale-105 active:scale-95"
          >
            Apply Filter
          </button>
        </div>

        {/* ===== SUMMARY CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition">
            <p className="text-zinc-400 text-sm">Total Collection</p>
            <h2 className="text-3xl font-bold mt-1 text-blue-400">
              ₹{summary?.total_collection || 0}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500 transition">
            <p className="text-zinc-400 text-sm">Paid Flats</p>
            <h2 className="text-3xl font-bold mt-1 text-emerald-400">
              {summary?.total_paid_flats || 0}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-red-500 transition">
            <p className="text-zinc-400 text-sm">Pending Flats</p>
            <h2 className="text-3xl font-bold mt-1 text-red-400">
              {summary?.total_pending_flats || 0}
            </h2>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="bg-zinc-800 text-sm text-zinc-300 sticky top-0 z-10">
                <tr>
                  <th className="p-4">Flat</th>
                  <th className="p-4">Resident</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount Paid</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-10 text-zinc-400">
                      Loading reports...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-10 text-zinc-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                    >
                      <td className="p-4 font-semibold">{r.flat_no}</td>
                      <td className="p-4">{r.full_name}</td>
                      <td className="p-4">
                        {new Date(r.due_date).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === "PAID"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="p-4 font-semibold">₹{r.amount_paid}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
