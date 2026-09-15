"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ShopForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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

    const { error } = await supabase
      .from("shops")
      .insert({
        name,
        address: address || null,
        city: city || null,
        state: state || null,
        description: description || null,
        is_active: true,
      });

    if (error) {
      console.error(error);

      setError(
        "Failed to create shop. Please try again."
      );

      setLoading(false);
      return;
    }

    router.push("/admin/shops");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block font-medium">
          Shop Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          className="w-full rounded-lg border p-3"
          placeholder="e.g. Ayam Gepuk Pak Gembus"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Address
        </label>

        <input
          type="text"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          placeholder="Street address"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            placeholder="e.g. Kuala Lumpur"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            State
          </label>

          <input
            type="text"
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            placeholder="e.g. Selangor"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
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
          {loading ? "Saving..." : "Add Shop"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/shops")
          }
          className="rounded-lg border px-5 py-3 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}