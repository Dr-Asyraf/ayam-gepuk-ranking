"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type EditReviewFormProps = {
  visit: {
    id: string;
    visitedAt: string;
    comments: string | null;
    chicken: number;
    sambalKacang: number;
    sayur: number;
    sides: number;
    vegetables: string[];
    selectedSides: string[];
  };
};

const vegetablesOptions = ["Kubis", "Kangkung", "Bayam Goreng"];

const sidesOptions = [
  "Tempe",
  "Tauhu",
  "Telur",
  "Pedal",
  "Enoki / Mushroom Goreng",
];

export default function EditReviewForm({ visit }: EditReviewFormProps) {
  const router = useRouter();

  const [visitedAt, setVisitedAt] = useState(visit.visitedAt);

  const [chicken, setChicken] = useState(String(visit.chicken));

  const [sambalKacang, setSambalKacang] = useState(String(visit.sambalKacang));

  const [sayur, setSayur] = useState(String(visit.sayur));

  const [sides, setSides] = useState(String(visit.sides));

  const [vegetables, setVegetables] = useState<string[]>(visit.vegetables);

  const [selectedSides, setSelectedSides] = useState<string[]>(
    visit.selectedSides,
  );

  const [comments, setComments] = useState(visit.comments ?? "");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const toggleVegetable = (vegetable: string) => {
    setVegetables((current) =>
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

    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();

      // Validate ratings
      const ratings = [
        Number(chicken),
        Number(sambalKacang),
        Number(sayur),
        Number(sides),
      ];

      const invalidRating = ratings.some(
        (rating) => Number.isNaN(rating) || rating < 0 || rating > 10,
      );

      if (invalidRating) {
        throw new Error("All ratings must be between 0 and 10.");
      }

      // Update visit
      const { error: visitError } = await supabase
        .from("visits")
        .update({
          visited_at: visitedAt,
          comments: comments.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", visit.id);

      if (visitError) {
        throw new Error(visitError.message);
      }

      // Update rating
      const { error: ratingError } = await supabase
        .from("ratings")
        .update({
          chicken: Number(chicken),
          sambal_kacang: Number(sambalKacang),
          sayur: Number(sayur),
          sides: Number(sides),
        })
        .eq("visit_id", visit.id);

      if (ratingError) {
        throw new Error(ratingError.message);
      }

      // Delete old vegetables
      const { error: vegetablesDeleteError } = await supabase
        .from("visit_vegetables")
        .delete()
        .eq("visit_id", visit.id);

      if (vegetablesDeleteError) {
        throw new Error(vegetablesDeleteError.message);
      }

      // Insert updated vegetables
      if (vegetables.length > 0) {
        const vegetableRows = vegetables.map((vegetable) => ({
          visit_id: visit.id,
          vegetable,
        }));

        const { error: vegetablesInsertError } = await supabase
          .from("visit_vegetables")
          .insert(vegetableRows);

        if (vegetablesInsertError) {
          throw new Error(vegetablesInsertError.message);
        }
      }

      // Delete old sides
      const { error: sidesDeleteError } = await supabase
        .from("visit_sides")
        .delete()
        .eq("visit_id", visit.id);

      if (sidesDeleteError) {
        throw new Error(sidesDeleteError.message);
      }

      // Insert updated sides
      if (selectedSides.length > 0) {
        const sideRows = selectedSides.map((side) => ({
          visit_id: visit.id,
          side,
        }));

        const { error: sidesInsertError } = await supabase
          .from("visit_sides")
          .insert(sideRows);

        if (sidesInsertError) {
          throw new Error(sidesInsertError.message);
        }
      }

      setMessage("Review updated successfully!");

      router.refresh();
      router.push("/admin/reviews");
    } catch (error) {
      console.error("UPDATE REVIEW ERROR:", error);

      setMessage(
        error instanceof Error ? error.message : "Failed to update review.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
      {/* Visit date */}
      <div>
        <label htmlFor="visitedAt" className="block text-sm font-medium">
          Visit date
        </label>

        <input
          id="visitedAt"
          type="date"
          value={visitedAt}
          onChange={(event) => setVisitedAt(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      {/* Chicken */}
      <div className="mt-6">
        <label htmlFor="chicken" className="block text-sm font-medium">
          🍗 Chicken
        </label>

        <input
          id="chicken"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={chicken}
          onChange={(event) => setChicken(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      {/* Sambal */}
      <div className="mt-6">
        <label htmlFor="sambalKacang" className="block text-sm font-medium">
          🌶️ Sambal & Kacang
        </label>

        <input
          id="sambalKacang"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={sambalKacang}
          onChange={(event) => setSambalKacang(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      {/* Sayur rating */}
      <div className="mt-6">
        <label htmlFor="sayur" className="block text-sm font-medium">
          🥬 Sayur Rating
        </label>

        <input
          id="sayur"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={sayur}
          onChange={(event) => setSayur(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      {/* Vegetables */}
      <div className="mt-6">
        <p className="text-sm font-medium">🥬 Vegetables</p>

        <p className="mt-1 text-sm text-stone-500">Select one or more.</p>

        <div className="mt-3 space-y-2">
          {vegetablesOptions.map((vegetable) => (
            <label
              key={vegetable}
              className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 hover:bg-stone-100"
            >
              <input
                type="checkbox"
                checked={vegetables.includes(vegetable)}
                onChange={() => toggleVegetable(vegetable)}
              />

              <span>{vegetable}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sides rating */}
      <div className="mt-6">
        <label htmlFor="sides" className="block text-sm font-medium">
          🍳 Sides Rating
        </label>

        <input
          id="sides"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={sides}
          onChange={(event) => setSides(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          required
        />
      </div>

      {/* Sides */}
      <div className="mt-6">
        <p className="text-sm font-medium">🍳 Sides</p>

        <p className="mt-1 text-sm text-stone-500">
          Select the sides you ordered.
        </p>

        <div className="mt-3 space-y-2">
          {sidesOptions.map((side) => (
            <label
              key={side}
              className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 hover:bg-stone-100"
            >
              <input
                type="checkbox"
                checked={selectedSides.includes(side)}
                onChange={() => toggleSide(side)}
              />

              <span>{side}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <label htmlFor="comments" className="block text-sm font-medium">
          Comments
        </label>

        <textarea
          id="comments"
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          rows={5}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          placeholder="What did you think?"
        />
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={saving}
        className="mt-8 w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-stone-600">{message}</p>
      )}
    </form>
  );
}
