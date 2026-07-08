import React from 'react';

export default function MoviePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Página de Película</h1>
        <p className="text-gray-400">ID de película: {params.id}</p>
        <p className="text-gray-500 text-sm mt-2">Esta página está en construcción.</p>
      </div>
    </div>
  );
}
