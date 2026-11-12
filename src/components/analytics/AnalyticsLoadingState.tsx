"use client";

export function AnalyticsLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-secondary border border-border" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-secondary border border-border" />
      <div className="h-48 rounded-lg bg-secondary border border-border" />
    </div>
  );
}
