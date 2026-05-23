import React, { useState } from "react";
import { BookOpen, Moon, Search, Sun } from "lucide-react";

export default function Topbar({ label, title, query, searchPlaceholder, onQueryChange, onSearch, theme, onThemeToggle }) {
  const [logoFailed, setLogoFailed] = useState(false);

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <header className="topbar">
      <div className="hero-brand" aria-hidden="true">
        <span className="hero-mark">
          {logoFailed ? (
            <BookOpen className="hero-mark-fallback" size={24} strokeWidth={1.8} />
          ) : (
            <img src="./assets/branding/hirz-symbol.png" alt="" loading="eager" decoding="async" onError={() => setLogoFailed(true)} />
          )}
        </span>
      </div>

      <div className="title-block">
        <div>
          <h2 className="hero-logo-word" aria-label="حِرز">حِرز</h2>
          <p className="topbar-subtitle">أذكار وقران</p>
          <p className="hero-dedication">صدقة عني و عن امي و ابي و جميع المسلمين</p>
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

        <form className="search-box" role="search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <button className="search-submit" type="submit" aria-label="بحث">
            <Search size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
