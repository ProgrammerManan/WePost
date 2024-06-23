import React, { useState } from 'react';

interface LocationAutocompleteProps {
  onSelect: (place: any) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);

    if (query.length > 2) {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=5084c889755240efa98805bcbd5956c4=5`);
      const data = await response.json();
      setSuggestions(data.results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: any) => {
    onSelect(suggestion);
    setQuery(suggestion.formatted);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="shad-input"
        placeholder="Type a location"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelect(suggestion)}>
              {suggestion.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
