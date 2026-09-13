"use client";
import { createReview } from "@/app/actions/visits";

import { useState } from "react";

type Shop = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
};

type ReviewFormProps = {
  shops: Shop[];
};

const vegetables = ["Kubis", "Kangkung", "Bayam Goreng"];

const sides = ["Tempe", "Tauhu", "Telur", "Pedal", "Enoki / Mushroom Goreng"];

export default function ReviewForm({ shops }: ReviewFormProps) {
  const [shopId, setShopId] = useState("");
  const [visitedAt, setVisitedAt] = useState("");

  const [chicken, setChicken] = useState("");
  const [sambalKacang, setSambalKacang] = useState("");
  const [sayur, setSayur] = useState("");
  const [sidesRating, setSidesRating] = useState("");

  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);

  const [selectedSides, setSelectedSides] = useState<string[]>([]);

  const [comments, setComments] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const calculateOverall = () => {
    const ratings = [
      Number(chicken),
      Number(sambalKacang),
      Number(sayur),
      Number(sidesRating),
    ];

    if (ratings.some((rating) => !rating)) {
      return null;
    }

    return ratings.reduce((total, rating) => total + rating, 0) / 4;
  };

  const overall = calculateOverall();

  const toggleVegetable = (vegetable: string) => {
    setSelectedVegetables((current) =>
      current.includes(vegetable)
        ? current.filter((item) => item !== vegetable)
        : [...current, vegetable],
    );
  };

  const toggleSide = (side: string) => {
    setSelectedSides((current) =>
      current.includes(side)
        ? current.filter((item) => item !== side)
        : [...current, side],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    const result = await createReview({
      shopId,
      visitedAt,

      chicken: Number(chicken),
      sambalKacang: Number(sambalKacang),
      sayur: Number(sayur),
      sides: Number(sidesRating),

      vegetables: selectedVegetables as any,
      sidesAvailable: selectedSides as any,

      comments,
    });

    setIsSaving(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    alert("Review saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SHOP */}

      <div>
        <label className="mb-2 block font-medium">Shop</label>

        <select
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        >
          <option value="">Select a shop</option>

          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
              {shop.city ? ` — ${shop.city}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* DATE */}

      <div>
        <label className="mb-2 block font-medium">Date visited</label>

        <input
          type="date"
          value={visitedAt}
          onChange={(e) => setVisitedAt(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* CHICKEN */}

      <RatingInput label="🍗 Chicken" value={chicken} onChange={setChicken} />

      {/* SAMBAL */}

      <RatingInput
        label="🌶️ Sambal & Kacang"
        value={sambalKacang}
        onChange={setSambalKacang}
      />

      {/* SAYUR */}

      <div>
        <label className="mb-3 block font-medium">🥬 Sayur available</label>

        <div className="space-y-2">
          {vegetables.map((vegetable) => (
            <label
              key={vegetable}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={selectedVegetables.includes(vegetable)}
                onChange={() => toggleVegetable(vegetable)}
                className="h-4 w-4"
              />

              {vegetable}
            </label>
          ))}
        </div>
      </div>

      <RatingInput label="🥬 Sayur rating" value={sayur} onChange={setSayur} />

      {/* SIDES */}

      <div>
        <label className="mb-3 block font-medium">🍳 Sides available</label>

        <div className="space-y-2">
          {sides.map((side) => (
            <label
              key={side}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={selectedSides.includes(side)}
                onChange={() => toggleSide(side)}
                className="h-4 w-4"
              />

              {side}
            </label>
          ))}
        </div>
      </div>

      <RatingInput
        label="🍳 Sides rating"
        value={sidesRating}
        onChange={setSidesRating}
      />

      {/* COMMENTS */}

      <div>
        <label className="mb-2 block font-medium">Comments</label>

        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={5}
          className="w-full rounded-lg border p-3"
          placeholder="What did you think?"
        />
      </div>

      {/* OVERALL */}

      <div className="rounded-xl bg-gray-100 p-6">
        <p className="text-sm text-gray-500">Overall rating</p>

        <p className="text-4xl font-bold">
          {overall !== null ? `${overall.toFixed(2)} / 10` : "—"}
        </p>
      </div>

      {/* SUBMIT */}

      {error && (
        <p className="rounded-lg bg-red-100 p-4 text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Review"}
      </button>
    </form>
  );
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="0–10"
          required
        />

        <span>/ 10</span>
      </div>
    </div>
  );
}
