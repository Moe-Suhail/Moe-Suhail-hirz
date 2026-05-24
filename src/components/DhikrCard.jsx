import React from "react";
import { Check, RotateCcw, Star } from "lucide-react";

function MisbahaIcon() {
  return (
    <svg className="misbaha-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="2.1" />
      <circle cx="16.8" cy="7.7" r="1.75" />
      <circle cx="18.1" cy="13" r="1.75" />
      <circle cx="14.2" cy="17" r="1.75" />
      <circle cx="8.6" cy="16.6" r="1.75" />
      <circle cx="5.5" cy="12" r="1.75" />
      <circle cx="7.1" cy="7.4" r="1.75" />
      <path d="M12 7.1v3.7" />
      <path d="M12 17.8v2.2" />
      <path d="M10 20h4" />
    </svg>
  );
}

function formatDhikrText(text) {
  const normalized = text
    .replace(/\{/g, "﴿")
    .replace(/\}/g, "﴾")
    .replace(/\s+\*/g, " ")
    .replace(/\*\s+/g, " ");
  const istiadhahPattern = /^\s*[\(﴿\[]?\s*(أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ|أعوذ بالله من الشيطان الرجيم)\s*[\)﴾\]]?\s*/;
  const match = normalized.match(istiadhahPattern);
  if (!match) {
    return { istiadhah: "", body: normalized };
  }
  return {
    istiadhah: match[1],
    body: normalized.slice(match[0].length).trim()
  };
}

export default function DhikrCard({ item, count, isFavorite, onFavorite, onIncrement, onReset }) {
  const target = Number(item.target);
  const isCountable = Number.isFinite(target) && target > 0 && item.kind !== "guidance" && item.kind !== "dua";
  const done = isCountable && count >= target;
  const formattedText = formatDhikrText(item.text);
  const cardClassName = `dhikr-card${isCountable ? "" : " guidance-card"}`;
  const noteTitle = item.kind === "guidance" ? "فضل أو حديث صحيح" : "فضل أو حديث مرتبط";
  const guidanceLabel = item.kind === "guidance" ? "نص فضل وحث بلا عداد" : "دعاء بلا عدد محدد";

  return (
    <article className={cardClassName}>
      <div className="card-head">
        <span className="tag">{item.category}</span>
        <button className={`icon-btn ${isFavorite ? "active" : ""}`} type="button" onClick={onFavorite} aria-label="إضافة للمفضلة">
          <Star size={20} fill="currentColor" />
        </button>
      </div>

      <div className="dhikr-text">
        {formattedText.istiadhah && <span className="dhikr-istiadhah">{formattedText.istiadhah}</span>}
        <p>{formattedText.body}</p>
      </div>

      {item.note && (
        <div className="dhikr-note">
          <span>{noteTitle}</span>
          <p>{item.note}</p>
        </div>
      )}

      <div className="note-row">
        <span className={isCountable ? "repeat-badge" : ""}>{isCountable ? `×${target}` : guidanceLabel}</span>
      </div>

      {isCountable && (
        <div className="dhikr-actions">
          <button className={done ? "done-btn" : "primary-btn"} type="button" onClick={onIncrement}>
            {done ? <Check size={18} aria-hidden="true" /> : <MisbahaIcon />}
            {done ? "تم" : "تكرار"}
            <span className="button-count">
              {Math.min(count, target)}/{target}
            </span>
          </button>
          <button className="reset-btn" type="button" onClick={onReset} aria-label="تصفير عداد الذكر">
            <RotateCcw size={17} aria-hidden="true" />
            تصفير
          </button>
        </div>
      )}
    </article>
  );
}
