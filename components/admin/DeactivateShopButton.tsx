"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateShop } from "@/app/actions/shops";

type DeactivateShopButtonProps = {
  shopId: string;
};

export default function DeactivateShopButton({
  shopId,
}: DeactivateShopButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this shop?",
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await deactivateShop(shopId);

    if (!result.success) {
      console.error("DEACTIVATE SHOP ERROR:", result.error);

      alert(`Failed to deactivate shop.\n\n${result.error}`);

      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleDeactivate}
      disabled={loading}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Deactivating..." : "Deactivate"}
    </button>
  );
}
