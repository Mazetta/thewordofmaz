'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirection vers une page de recherche ou filtre
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 h-8 rounded-full border border-input bg-background text-base focus-visible:ring-0"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
    </form>
  );
}
