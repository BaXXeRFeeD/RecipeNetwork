import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

const SearchBar = ({ onSearch }) => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    return (
        <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск рецептов..."
            className="w-full border p-2 mb-4"
        />
    );
};

export default SearchBar;