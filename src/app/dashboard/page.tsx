/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetch("/api/faq").then((r) => r.json()).then(setFaqs);
    fetch("/api/chats").then((r) => r.json()).then(setChats);
  }, []);

  async function addFaq() {
    if (!question || !answer) return;
    await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    setQuestion("");
    setAnswer("");
    const res = await fetch("/api/faq");
    setFaqs(await res.json());
  }

  async function deleteFaq(id: number) {
    await fetch("/api/faq", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const res = await fetch("/api/faq");
    setFaqs(await res.json());
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard Customer Care WA</h1>

        <section className="bg-white rounded-xl p-6 shadow mb-8">
          <h2 className="font-semibold text-lg mb-4">Tambah FAQ</h2>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Pertanyaan"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm"
            />
            <textarea
              placeholder="Jawaban"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              className="border rounded-lg px-4 py-2 text-sm"
            />
            <button onClick={addFaq} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-fit">
              Simpan FAQ
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">Daftar FAQ ({faqs.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {faqs.map((f: any) => (
                <div key={f.id} className="border rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{f.question}</p>
                      <p className="text-gray-500 mt-1">{f.answer}</p>
                    </div>
                    <button onClick={() => deleteFaq(f.id)} className="text-red-500 text-xs ml-2">Hapus</button>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && <p className="text-gray-400 text-sm">Belum ada FAQ</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">Riwayat Chat</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chats.map((c: any) => (
                <div key={c.id} className={`text-sm p-3 rounded-lg ${c.sender === "customer" ? "bg-blue-50" : "bg-green-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${c.sender === "customer" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}>
                      {c.sender === "customer" ? "Customer" : "Agent"}
                    </span>
                    <span className="text-gray-400 text-xs">{c.wa_id}</span>
                  </div>
                  <p className="text-gray-700">{c.message}</p>
                </div>
              ))}
              {chats.length === 0 && <p className="text-gray-400 text-sm">Belum ada chat</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
