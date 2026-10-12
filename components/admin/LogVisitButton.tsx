"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logVisit } from "@/app/actions/visits";

type LogVisitButtonProps = {
  shopId: string;
  visitedToday: boolean;
  compact?: boolean;
};

export default function LogVisitButton({
  shopId,
  visitedToday,
  compact = false,
}: LogVisitButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loggedToday, setLoggedToday] = useState(visitedToday);
  const [error, setError] = useState("");

  const handleLogVisit = async () => {
    setLoading(true);
    setError("");

    const result = await logVisit(shopId);

    setLoading(false);

    if (!result.success) {
      if (compact) {
        alert(`Failed to log visit.\n\n${result.error}`);
      } else {
        setError(result.error ?? "Something went wrong.");
      }

      return;
    }

    setLoggedToday(true);
    router.refresh();
  };

  if (loggedToday) {
    return compact ? (
      <span className="whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
        Visited today
      </span>
    ) : (
      <p className="rounded-lg border border-green-300 bg-green-50 px-5 py-3 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
        Visited today
      </p>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleLogVisit}
        disabled={loading}
        className="whitespace-nowrap text-sm font-medium text-orange-600 hover:underline disabled:opacity-50 dark:text-orange-400"
      >
        {loading ? "Logging..." : "Log visit"}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogVisit}
        disabled={loading}
        className="rounded-lg bg-orange-600 px-5 py-3 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Logging visit..." : "I visited today"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
