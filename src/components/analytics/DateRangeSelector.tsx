"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { type DateRangeSelection, type AnalyticsPreset } from "@/types/analytics";

interface Props {
  value: DateRangeSelection;
  onChange: (value: DateRangeSelection) => void;
}

const PRESETS: { value: AnalyticsPreset; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

function presetToRange(preset: AnalyticsPreset): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  if (preset === "24h") from.setHours(from.getHours() - 24);
  else if (preset === "7d") from.setDate(from.getDate() - 7);
  else if (preset === "30d") from.setDate(from.getDate() - 30);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function DateRangeSelector({ value, onChange }: Props) {
  const [customFrom, setCustomFrom] = useState(value.from.slice(0, 10));
  const [customTo, setCustomTo] = useState(value.to.slice(0, 10));

  const handlePreset = (preset: AnalyticsPreset) => {
    if (preset === "custom") {
      onChange({ preset, from: value.from, to: value.to });
      return;
    }
    const range = presetToRange(preset);
    onChange({ preset, from: range.from, to: range.to });
  };

  const applyCustom = () => {
    if (!customFrom || !customTo) return;
    onChange({ preset: "custom", from: new Date(customFrom).toISOString(), to: new Date(customTo + "T23:59:59").toISOString() });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              value.preset === p.value
                ? "bg-accent text-white"
                : "text-secondary hover:text-primary hover:bg-tertiary"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {value.preset === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="px-2 py-1.5 text-xs rounded border border-border bg-secondary text-primary"
          />
          <span className="text-xs text-secondary">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="px-2 py-1.5 text-xs rounded border border-border bg-secondary text-primary"
          />
          <button
            onClick={applyCustom}
            className="px-3 py-1.5 text-xs rounded border border-border bg-secondary text-primary hover:bg-tertiary"
          >
            Apply
          </button>
        </div>
      )}
      <CalendarDays className="w-4 h-4 text-secondary hidden sm:block" />
    </div>
  );
}
