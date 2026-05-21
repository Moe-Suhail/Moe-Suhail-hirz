import React from "react";
import { Check, RotateCcw, Star, Target } from "lucide-react";

export default function DhikrCard({ item, count, isFavorite, onFavorite, onIncrement, onReset }) {
  const done = count >= item.target;

  return (
    <article className="dhikr-card">
      <div className="card-head">
        <span className="tag">{item.category}</span>
        <button className={`icon-btn ${isFavorite ? "active" : ""}`} type="button" onClick={onFavorite} aria-label="إضافة للمفضلة">
          <Star size={20} fill="currentColor" />
        </button>
      </div>

      <p className="dhikr-text">{item.text}</p>

      {item.note && <p className="dhikr-note">{item.note}</p>}

      <div className="note-row">
        <span>{item.target > 1 ? `يكرر ${item.target} مرات` : "مرة واحدة"}</span>
      </div>

      <div className="dhikr-actions">
        <button className={done ? "done-btn" : "primary-btn"} type="button" onClick={onIncrement}>
          {done ? <Check size={18} aria-hidden="true" /> : <Target size={18} aria-hidden="true" />}
          {done ? "تم" : "تكرار"}
          <span className="button-count">
            {Math.min(count, item.target)} / {item.target}
          </span>
        </button>
        <button className="reset-btn" type="button" onClick={onReset} aria-label="تصفير عداد الذكر">
          <RotateCcw size={17} aria-hidden="true" />
          تصفير
        </button>
      </div>
    </article>
  );
}
