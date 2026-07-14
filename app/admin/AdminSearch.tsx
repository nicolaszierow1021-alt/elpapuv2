"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export function AdminSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [text, setText] = useState(initialQuery);
  const [query] = useDebounce(text, 500); // Wait 500ms after user stops typing before searching

  useEffect(() => {
    if (query) {
      router.push(`/admin?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/admin`);
    }
  }, [query, router]);

  const handleClear = () => {
    setText('');
    router.push(`/admin`);
  };

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-surface text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 sm:text-sm transition-all"
        placeholder="Buscar por título (Películas o Series)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {text && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
