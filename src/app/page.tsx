export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="text-center text-white px-6">
        <h1 className="text-4xl font-bold mb-4">Customer Care WA Agent</h1>
        <p className="text-blue-200 mb-8">AI-powered WhatsApp customer service untuk UKM Anda.</p>
        <a
          href="/dashboard"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          Buka Dashboard
        </a>
      </div>
    </main>
  );
}
