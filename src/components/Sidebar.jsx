import React from "react";
import { Moon, Sun } from "lucide-react";

export default function Sidebar({ views, activeView, progress, theme, onThemeToggle, onViewChange }) {
  return (
    <aside className="sidebar" aria-label="التنقل الرئيسي">
      <div className="brand">
        <img className="brand-logo" src="./hirz-logo.png" alt="لوقو حرز" />
        <div>
          <h1>حرز</h1>
          <p>أذكار وقرآن</p>
          <small>تصميم وتطوير محمد عادل حسن طه</small>
        </div>
      </div>

      <div className="dedication-card">
        <span>صدقة جارية</span>
        <p className="dedication-line">لروح جدي و جدتي</p>
        <strong>عبد الرحمن محمد احمد</strong>
        <strong>ست النور محمد عثمان</strong>
        <p className="dedication-dua">ولجميع أمواتنا وأموات المسلمين</p>
      </div>

      <nav className="nav-tabs" aria-label="أقسام التطبيق">
        {Object.entries(views).map(([key, view]) => {
          const Icon = view.icon;
          return (
            <button
              className={`nav-tab ${activeView === key ? "active" : ""}`}
              type="button"
              key={key}
              onClick={() => onViewChange(key)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{view.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="theme-toggle" type="button" onClick={onThemeToggle} aria-label="تبديل الوضع الليلي">
        {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        <span>{theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}</span>
      </button>

      <div className="daily-card">
        <span>ورد اليوم</span>
        <strong>{progress}%</strong>
        <div className="progress-track" aria-hidden="true">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </aside>
  );
}
