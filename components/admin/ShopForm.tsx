"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Shop = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  is_active: boolean;
};

type ShopFormProps = {
  shop?: Shop;
};

export default function ShopForm({ shop }: ShopFormProps) {
  const router = useRouter();

  const isEditing = !!shop;

  const [name, setName] = useState(shop?.name ?? "");

  const [address, setAddress] = useState(shop?.address ?? "");

  const [city, setCity] = useState(shop?.city ?? "");

  const [state, setState] = useState(shop?.state ?? "");

  const [description, setDescription] = useState(shop?.description ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const shopData = {
      name,
      address: address || null,
      city: city || null,
      state: state || null,
      description: description || null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("shops")
        .update(shopData)
        .eq("id", shop.id);

      if (error) {
        console.error(error);

        setError("Failed to update shop. Please try again.");

        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("shops").insert({
        ...shopData,
        is_active: true,
      });

      if (error) {
        console.error(error);

        setError("Failed to create shop. Please try again.");

        setLoading(false);
        return;
      }
    }

    router.push("/admin/shops");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block font-medium">Shop Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border p-3"
          placeholder="e.g. Ayam Gepuk Pak Gembus"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Address</label>

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Street address"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">City</label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="e.g. Kuala Lumpur"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">State</label>

          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="e.g. Selangor"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border p-3"
          placeholder="Short description of the shop..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Shop"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/shops")}
          className="rounded-lg border px-5 py-3 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
