"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateShop } from "@/app/actions/shops";

type ActivateShopButtonProps = {
  shopId: string;
};

export default function ActivateShopButton({
  shopId,
}: ActivateShopButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to activate this shop?",
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await activateShop(shopId);

    if (!result.success) {
      console.error("ACTIVATE SHOP ERROR:", result.error);

      alert(`Failed to activate shop.\n\n${result.error}`);

      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleActivate}
      disabled={loading}
      className="font-medium text-green-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Activating..." : "Activate"}
    </button>
  );
}