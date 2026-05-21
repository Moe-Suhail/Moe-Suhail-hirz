import React from "react";
import { Home } from "lucide-react";

export default function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <Home size={22} aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
