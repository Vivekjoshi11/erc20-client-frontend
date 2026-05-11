

// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          NTT Token Portal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Manage your Non-Tradable Tokens with ease. Access admin controls, user transactions, and NTT operations from one centralized dashboard.
        </p>
        <Link href="/about" className="inline-block bg-muted text-foreground font-semibold py-2 px-4 rounded-lg hover:bg-muted/80 transition">
          Learn More About NTTs
        </Link>
      </div>

      <div className="grid gap-6 w-full max-w-2xl md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-accent mb-4">Admin Actions</h2>
          <Link href="/admin/register" className="block bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            Register NTT
          </Link>
          <Link href="/admin/credit" className="block bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            Credit Tokens to NTT
          </Link>
          <Link href="/admin/dashboard" className="block bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            Admin Dashboard (Wallet)
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-accent mb-4">User & NTT Actions</h2>
          <Link href="/user/send" className="block bg-card hover:bg-green-600 text-card-foreground hover:text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            Send Tokens to NTT
          </Link>
          <Link href="/user/dashboard" className="block bg-card hover:bg-green-600 text-card-foreground hover:text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            User History
          </Link>
          <Link href="/ntt/send" className="block bg-card hover:bg-purple-600 text-card-foreground hover:text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            NTT: Send to User
          </Link>
          <Link href="/ntt/refund" className="block bg-card hover:bg-purple-600 text-card-foreground hover:text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            NTT: Refund to Admin
          </Link>
          <Link href="/ntt/history" className="block bg-card hover:bg-gray-600 text-card-foreground hover:text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border border-border">
            NTT Transaction History
          </Link>
        </div>
      </div>
    </main>
  );
}


