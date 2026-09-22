import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  return {
    title: shop?.name ?? "Shop not found",
  };
}

export default async function ShopPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  /*
   * Get shop information
   */
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (shopError || !shop) {
    console.error("FAILED TO LOAD SHOP:", shopError);

    notFound();
  }

  /*
   * Get primary photo
   */
  const { data: primaryPhoto } = await supabase
    .from("photos")
    .select("image_url, caption")
    .eq("shop_id", id)
    .eq("is_primary", true)
    .limit(1)
    .maybeSingle();

  /*
   * Get all visits
   */
  const { data: visits, error: visitsError } = await supabase
    .from("visits")
    .select(
      `
        id,
        visited_at,
        comments,
        ratings (
          chicken,
          sambal_kacang,
          sayur,
          sides
        ),
        visit_vegetables (
          vegetable
        ),
        visit_sides (
          side
        )
      `,
    )
    .eq("shop_id", id)
    .order("visited_at", {
      ascending: false,
    });

  if (visitsError) {
    console.error("FAILED TO LOAD VISITS:", visitsError);
  }

  /*
   * Calculate overall/category ratings
   *
   * We calculate these here rather than depending
   * on the ranking view.
   */
  const ratings =
    visits?.flatMap((visit) => {
      const rating = Array.isArray(visit.ratings)
        ? visit.ratings[0]
        : visit.ratings;

      return rating ? [rating] : [];
    }) ?? [];

  const average = (values: number[]) => {
    if (values.length === 0) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const chickenRating = average(
    ratings.map((rating) => Number(rating.chicken)),
  );

  const sambalKacangRating = average(
    ratings.map((rating) => Number(rating.sambal_kacang)),
  );

  const sayurRating = average(ratings.map((rating) => Number(rating.sayur)));

  const sidesRating = average(ratings.map((rating) => Number(rating.sides)));

  const overallRating = average([
    ...ratings.map(
      (rating) =>
        (Number(rating.chicken) +
          Number(rating.sambal_kacang) +
          Number(rating.sayur) +
          Number(rating.sides)) /
        4,
    ),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Back */}
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          ← Back to rankings
        </Link>

        {/* Hero */}
        <div className="mt-6 overflow-hidden rounded-3xl border bg-white">
          {primaryPhoto ? (
            <div className="aspect-[16/7] w-full overflow-hidden bg-stone-100">
              <img
                src={primaryPhoto.image_url}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/7] w-full items-center justify-center bg-stone-100">
              <div className="text-center">
                <div className="text-7xl">🍗</div>

                <p className="mt-2 text-sm text-stone-400">No photo available</p>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold">{shop.name}</h1>

                {(shop.city || shop.state) && (
                  <p className="mt-2 text-stone-500">
                    {[shop.city, shop.state].filter(Boolean).join(", ")}
                  </p>
                )}

                {shop.address && (
                  <p className="mt-2 text-sm text-stone-500">{shop.address}</p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <p className="text-5xl font-bold">{overallRating.toFixed(2)}</p>

                <p className="text-stone-400">/ 10 overall</p>
              </div>
            </div>

            {/* Description */}
            {shop.description && (
              <p className="mt-6 max-w-3xl whitespace-pre-line text-stone-700">
                {shop.description}
              </p>
            )}

            {/* Visit count */}
            <p className="mt-6 text-sm text-stone-500">
              {visits?.length ?? 0}{" "}
              {(visits?.length ?? 0) === 1 ? "visit" : "visits"}
            </p>
          </div>
        </div>

        {/* Ratings */}
        <section className="mt-6">
          <h2 className="text-2xl font-bold">Ratings</h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <RatingCard emoji="🍗" label="Chicken" value={chickenRating} />

            <RatingCard
              emoji="🌶️"
              label="Sambal & Kacang"
              value={sambalKacangRating}
            />

            <RatingCard emoji="🥬" label="Sayur" value={sayurRating} />

            <RatingCard emoji="🍳" label="Sides" value={sidesRating} />
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Reviews</h2>

          <div className="mt-4 space-y-5">
            {visits && visits.length > 0 ? (
              visits.map((visit) => {
                const rating = Array.isArray(visit.ratings)
                  ? visit.ratings[0]
                  : visit.ratings;

                const vegetables = visit.visit_vegetables ?? [];

                const sides = visit.visit_sides ?? [];

                const reviewOverall = rating
                  ? (Number(rating.chicken) +
                      Number(rating.sambal_kacang) +
                      Number(rating.sayur) +
                      Number(rating.sides)) /
                    4
                  : null;

                return (
                  <article
                    key={visit.id}
                    className="rounded-2xl border bg-white p-6"
                  >
                    {/* Review header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {formatDate(visit.visited_at)}
                        </p>
                      </div>

                      {reviewOverall !== null && (
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {reviewOverall.toFixed(2)}
                          </p>

                          <p className="text-xs text-stone-400">/ 10</p>
                        </div>
                      )}
                    </div>

                    {/* Ratings */}
                    {rating && (
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <MiniRating
                          emoji="🍗"
                          label="Chicken"
                          value={rating.chicken}
                        />

                        <MiniRating
                          emoji="🌶️"
                          label="Sambal"
                          value={rating.sambal_kacang}
                        />

                        <MiniRating
                          emoji="🥬"
                          label="Sayur"
                          value={rating.sayur}
                        />

                        <MiniRating
                          emoji="🍳"
                          label="Sides"
                          value={rating.sides}
                        />
                      </div>
                    )}

                    {/* Vegetables */}
                    {vegetables.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-medium text-stone-500">
                          Vegetables
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {vegetables.map((item) => (
                            <span
                              key={item.vegetable}
                              className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                            >
                              {item.vegetable}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sides */}
                    {sides.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-medium text-stone-500">
                          Sides
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {sides.map((item) => (
                            <span
                              key={item.side}
                              className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                            >
                              {item.side}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    {visit.comments && (
                      <div className="mt-5 border-t pt-5">
                        <p className="text-sm font-medium text-stone-500">
                          Comments
                        </p>

                        <p className="mt-2 whitespace-pre-line text-stone-700">
                          {visit.comments}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border bg-white p-8 text-center">
                <p className="text-stone-500">No reviews yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function RatingCard({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-sm text-stone-500">
        {emoji} {label}
      </p>

      <p className="mt-2 text-3xl font-bold">{value.toFixed(2)}</p>

      <p className="text-sm text-stone-400">/ 10</p>
    </div>
  );
}

function MiniRating({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <p className="text-xs text-stone-500">
        {emoji} {label}
      </p>

      <p className="mt-1 font-bold">
        {Number(value).toFixed(2)}
        <span className="font-normal text-stone-400"> / 10</span>
      </p>
    </div>
  );
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
