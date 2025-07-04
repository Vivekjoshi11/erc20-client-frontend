

// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
     
       <h1 className="text-4xl font-bold mb-6 text-blue-700">Welcome to NTT Token Portal</h1>
   
      <div className="grid gap-4 w-full max-w-md">
        <Link href="/admin/register" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded text-center">
          Admin: Register NTT
        </Link>
        <Link href="/admin/credit" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded text-center">
          Admin: credit tokens to ntt
        </Link>
         <Link href="/admin/dashboard" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded text-center">
          Admin: dashboard (wallet)
          
        </Link>
        <Link href="/user/send" className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded text-center">
          User: Send Tokens to NTT
        </Link>
        <Link href="/user/dashboard" className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded text-center">
          User: History
        </Link>
        <Link href="/ntt/send" className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded text-center">
          NTT: Send Tokens to User
        </Link>
        <Link href="/ntt/refund" className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded text-center">
          NTT: refund to Admin
        </Link>
        {/* <Link href="/history/NTT" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded text-center">
          View NTT Transaction History
        </Link> */}
        <Link href="/ntt/history" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded text-center">
          View NTT Transaction History of connected wallet
        </Link>
      </div>
    </main>
  );
}


