'use client';

import React, { useState } from 'react';
import { AiResponseCard } from '@/components/AiResponseCard';
import { AIResponse } from '@/types';
import { Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context: 'assistant' }),
      });

      if (!res.ok) throw new Error('Gagal menghubungi server.');

      const data: AIResponse = await res.json();
      setResult(data);
    } catch {
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
      <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Jernih.
          </h1>
          <p className="text-neutral-500 text-lg">
            Informasi yang terang, bukan yang bising.
          </p>
        </div>

        <div className="w-full max-w-3xl mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white border border-neutral-200 rounded-xl shadow-subtle overflow-hidden focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ceritakan situasi Anda (misal: 'Saya kehilangan kartu BPJS...')"
                className="w-full py-4 pl-6 pr-12 outline-none text-neutral-800 placeholder:text-neutral-400 bg-transparent text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 p-2 text-neutral-400 hover:text-neutral-800 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>

        <div className="w-full">
          {result && <AiResponseCard data={result} />}
        </div>

      </div>
    </main>
  );
}
