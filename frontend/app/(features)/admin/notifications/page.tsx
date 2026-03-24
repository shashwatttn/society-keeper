"use client";
import React, { useState } from "react";

const SendNotifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"ALL" | "PENDING">("ALL");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Enter title and message");
      return;
    }

    setSending(true);

    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/send-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            message: message.trim(),
            target_type: target,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Notification sent ✅");
        setTitle("");
        setMessage("");
        setTarget("ALL");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Send Notification</h1>
          <p className="text-zinc-500 text-sm">
            Broadcast announcements to residents
          </p>
        </div>

        {/* FORM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          {/* TARGET */}
          <div>
            <label className="text-xs text-zinc-400">Send To</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as "ALL" | "PENDING")}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
            >
              <option value="ALL">All Residents</option>
              <option value="PENDING">Residents with Pending Dues</option>
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-xs text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
              placeholder="Water maintenance tomorrow"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-xs text-zinc-400">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded resize-none"
              placeholder="Please note water supply will be off..."
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNotifications;
