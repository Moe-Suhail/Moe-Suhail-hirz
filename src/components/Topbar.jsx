import React from "react";
import { Moon, Search, Sun } from "lucide-react";

export default function Topbar({ label, title, query, searchPlaceholder, onQueryChange, theme, onThemeToggle }) {
  return (
    <header className="topbar">
      <div className="title-block">
        <div>
          <h2>{label}</h2>
          <p className="topbar-subtitle">{title}</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="header-theme-toggle" type="button" onClick={onThemeToggle} aria-label="تبديل الوضع الليلي">
          <span className={theme === "light" ? "active" : ""}>
            <Sun size={17} aria-hidden="true" />
            نهاري
          </span>
          <span className={theme === "dark" ? "active" : ""}>
            <Moon size={17} aria-hidden="true" />
            ليلي
          </span>
        </button>

        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
      </div>
    </header>
  );
}
