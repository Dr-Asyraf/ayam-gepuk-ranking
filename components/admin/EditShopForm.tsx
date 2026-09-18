"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EditShopFormProps = {
  shop: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    description: string | null;
  };
};

export default function EditShopForm({ shop }: EditShopFormProps) {
  const [name, setName] = useState(shop.name);
  const [address, setAddress] = useState(shop.address ?? "");
  const [city, setCity] = useState(shop.city ?? "");
  const [state, setState] = useState(shop.state ?? "");
  const [description, setDescription] = useState(shop.description ?? "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Shop name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("shops")
        .update({
          name: name.trim(),
          address: address.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          description: description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shop.id);

      if (error) {
        console.error("UPDATE SHOP ERROR:", error);

        throw new Error(error.message);
      }

      setMessage("Shop updated successfully!");
    } catch (error) {
      console.error("UPDATE SHOP FAILED:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to update shop.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-bold">Edit Shop</h2>

      <p className="mt-1 text-sm text-gray-500">Update the shop information.</p>

      {/* Name */}
      <div className="mt-6">
        <label htmlFor="name" className="block text-sm font-medium">
          Shop name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
          required
        />
      </div>

      {/* Address */}
      <div className="mt-5">
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>

        <textarea
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
        />
      </div>

      {/* City + State */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-medium">
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium">
            State
          </label>

          <input
            id="state"
            type="text"
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="Tell people something about this shop..."
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-400"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </form>
  );
}
