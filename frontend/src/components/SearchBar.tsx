import { useEffect, useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(query.trim());
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="search-bar">
            <input
            type="text"
            placeholder="Search by company or position..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            />
        </div>
    );
}   

