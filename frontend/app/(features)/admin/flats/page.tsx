"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { FlatData } from "@/types";

export default function Flats() {
  const router = useRouter();

  const [flats, setFlats] = useState<FlatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getFlats = async () => {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored)?.token : null;
    if (!stored) return router.replace("/sign-in");

    const parsed = JSON.parse(stored);

    if (parsed.user.role !== "admin") {
      return router.replace("/resident/dashboard");
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/flats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const flats = await res.json();
      console.log("flat data :", flats.data);
      setFlats(flats?.data || []);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    getFlats();
  }, [router]);

  const filteredFlats = useMemo(() => {
    return flats.filter(
      (f) =>
        f.flat_no?.toLowerCase().includes(search.toLowerCase()) ||
        f.full_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, flats]);

  const deleteFlat = async (id: number) => {
    const confirmDelete = window.confirm("Delete flat?");
    if (!confirmDelete) return;

    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

    // rollback UI
    const previous = flats;
    setFlats((prev) => prev.filter((f) => f.flat_id !== id));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/delete-flat`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flat_id: id,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      alert("Failed to delete flat");
      setFlats(previous); // rollback UI
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/flats/edit/${id}`);
  };

  const flatColumns = [
    { header: "Flat No", accessor: "flat_no" },
    { header: "Owner", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    { header: "Type", accessor: "flat_type" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row: FlatData) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(row.flat_id)}
            className="px-4 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Edit
          </button>

          <button
            onClick={() => deleteFlat(row.flat_id)}
            className="px-4 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 p-8 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Flats</h1>

        <button
          onClick={() => router.push("/admin/flats/add")}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold transition shadow-lg"
        >
          + Add Flat
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search by flat no or owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full bg-zinc-900 px-5 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {/* STATES */}
      {loading && (
        <div className="text-center py-20 text-white/60">Loading flats...</div>
      )}

      {!loading && filteredFlats.length === 0 && (
        <div className="text-center py-20 text-white/60">No flats found</div>
      )}

      {!loading && filteredFlats.length > 0 && (
        <DataTable columns={flatColumns} data={filteredFlats} />
      )}
    </div>
  );
}
