"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-secondary p-8 text-center">
      <AlertTriangle className="w-6 h-6 text-red-400" />
      <p className="text-sm text-secondary">{message}</p>
      <Button onClick={onRetry} variant="outline" className="gap-2 border-border text-primary">
        <RefreshCw className="w-4 h-4" /> Retry
      </Button>
    </div>
  );
}
