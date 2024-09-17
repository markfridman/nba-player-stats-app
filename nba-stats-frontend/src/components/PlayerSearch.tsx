import React, { useRef } from 'react';
import { Input } from './ui/input';

interface PlayerSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({ searchTerm, onSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Search players..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};