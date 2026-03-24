"use client";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stored = localStorage.getItem("user");
        const token = stored ? JSON.parse(stored).token : null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading dashboard...
      </div>
    );

  const progress =
    stats.expectedRevenue > 0
      ? Math.min((stats.collectedRevenue / stats.expectedRevenue) * 100, 100)
      : 0;


  const chartData = {
    labels: ["Occupied", "Vacant"],
    datasets: [
      {
        data: [stats.occupiedFlats, stats.totalFlats - stats.occupiedFlats],
        backgroundColor: ["rgba(59,130,246,0.8)", "rgba(251,191,36,0.8)"],
        borderWidth: 0,
      },
    ],
  };

  const statCard = "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow";

  return (
    <div className="flex-1 m-4 bg-zinc-950 rounded-2xl p-8 text-white space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={statCard}>
          <p className="text-zinc-400 text-sm">Total Flats</p>
          <h3 className="text-3xl font-bold">{stats.totalFlats}</h3>
        </div>

        <div className={statCard}>
          <p className="text-zinc-400 text-sm">Occupied</p>
          <h3 className="text-3xl font-bold text-blue-400">
            {stats.occupiedFlats}
          </h3>
        </div>

        <div className={statCard}>
          <p className="text-zinc-400 text-sm">Pending Flats</p>
          <h3 className="text-3xl font-bold text-amber-400">
            {stats.pendingFlats}
          </h3>
        </div>

        <div className={statCard}>
          <p className="text-zinc-400 text-sm">Expected Revenue</p>
          <h3 className="text-3xl font-bold">₹{stats.expectedRevenue}</h3>
        </div>

        <div className={statCard}>
          <p className="text-zinc-400 text-sm">Collected</p>
          <h3 className="text-3xl font-bold text-emerald-400">
            ₹{stats.collectedRevenue}
          </h3>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLLECTION PROGRESS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Collection Progress</h2>

          <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-zinc-400 text-sm">
            ₹{stats.collectedRevenue} collected out of ₹{stats.expectedRevenue}
          </p>
        </div>

        {/* FLAT OCCUPANCY CHART */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-[350px]">
          <h2 className="text-xl font-semibold mb-4">Occupancy Distribution</h2>

          <div className="h-[260px]">
            <Doughnut data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
