import React from "react";
import { Search } from "lucide-react";

export default function Topbar({ label, title, query, searchPlaceholder, onQueryChange }) {
  return (
    <header className="topbar">
      <div className="title-block">
        <div>
          <h2>{label}</h2>
          <p className="topbar-subtitle">{title}</p>
        </div>
      </div>

      <label className="search-box">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
    </header>
  );
}
