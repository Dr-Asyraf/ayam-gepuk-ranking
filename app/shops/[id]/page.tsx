import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ShopPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get shop information
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  // Get ranking information
  const { data: ranking } = await supabase
    .from("shop_rankings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Get all rankings so we can determine this shop's position
  const { data: allRankings } = await supabase
    .from("shop_rankings")
    .select("id, overall_rating")
    .order("overall_rating", {
      ascending: false,
    });

  const rankingPosition = allRankings?.findIndex((item) => item.id === id);

  const rank =
    rankingPosition !== undefined && rankingPosition !== -1
      ? rankingPosition + 1
      : null;

  // Get reviews
  const { data: visits } = await supabase
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to rankings
        </Link>
      </div>

      {/* Shop header */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {rank && (
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                Ranked #{rank}
              </p>
            )}

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {shop.name}
            </h1>

            {(shop.city || shop.state) && (
              <p className="mt-3 text-gray-500">
                {[shop.city, shop.state].filter(Boolean).join(", ")}
              </p>
            )}

            {shop.address && (
              <p className="mt-1 text-gray-500">{shop.address}</p>
            )}

            {shop.description && (
              <p className="mt-5 max-w-2xl text-gray-600">{shop.description}</p>
            )}
          </div>

          {/* Overall score */}
          <div className="shrink-0 rounded-2xl border bg-white px-8 py-6 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">Overall</p>

            <p className="mt-1 text-5xl font-extrabold">
              {ranking?.overall_rating?.toFixed(2) ?? "—"}
            </p>

            <p className="text-sm text-gray-400">/ 10</p>

            <p className="mt-3 text-xs text-gray-400">
              {ranking?.visit_count ?? 0}{" "}
              {ranking?.visit_count === 1 ? "visit" : "visits"}
            </p>
          </div>
        </div>
      </section>

      {/* Ratings */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-2xl font-bold">📊 Ratings</h2>

          <p className="mt-1 text-sm text-gray-500">
            Each category contributes 25% to the overall rating.
          </p>

          <div className="mt-8 space-y-6">
            <RatingBar
              emoji="🍗"
              label="Chicken"
              value={Number(ranking?.chicken_rating ?? 0)}
            />

            <RatingBar
              emoji="🌶️"
              label="Sambal & Kacang"
              value={Number(ranking?.sambal_kacang_rating ?? 0)}
            />

            <RatingBar
              emoji="🥬"
              label="Sayur"
              value={Number(ranking?.sayur_rating ?? 0)}
            />

            <RatingBar
              emoji="🍳"
              label="Sides"
              value={Number(ranking?.sides_rating ?? 0)}
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold">📝 Reviews</h2>

        <p className="mt-1 text-sm text-gray-500">
          {visits?.length ?? 0} {visits?.length === 1 ? "visit" : "visits"}{" "}
          recorded
        </p>

        {!visits || visits.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center">
            <div className="text-4xl">🍗</div>

            <h3 className="mt-4 font-bold">No reviews yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              This shop hasn't been reviewed yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {visits.map((visit) => {
              const rating = Array.isArray(visit.ratings)
                ? visit.ratings[0]
                : visit.ratings;

              const reviewOverall = rating
                ? (
                    (Number(rating.chicken) +
                      Number(rating.sambal_kacang) +
                      Number(rating.sayur) +
                      Number(rating.sides)) /
                    4
                  ).toFixed(2)
                : null;

              return (
                <article
                  key={visit.id}
                  className="rounded-2xl border bg-white p-6"
                >
                  {/* Review header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">Visit</p>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(visit.visited_at).toLocaleDateString(
                          "en-MY",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    {reviewOverall && (
                      <div className="text-right">
                        <p className="text-2xl font-bold">{reviewOverall}</p>

                        <p className="text-xs text-gray-400">/ 10</p>
                      </div>
                    )}
                  </div>

                  {/* Category ratings */}
                  {rating && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <MiniRating
                        emoji="🍗"
                        label="Chicken"
                        value={Number(rating.chicken)}
                      />

                      <MiniRating
                        emoji="🌶️"
                        label="Sambal"
                        value={Number(rating.sambal_kacang)}
                      />

                      <MiniRating
                        emoji="🥬"
                        label="Sayur"
                        value={Number(rating.sayur)}
                      />

                      <MiniRating
                        emoji="🍳"
                        label="Sides"
                        value={Number(rating.sides)}
                      />
                    </div>
                  )}

                  {/* Vegetables */}
                  {visit.visit_vegetables?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold">
                        🥬 Vegetables available
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {visit.visit_vegetables.map((item) => (
                          <span
                            key={item.vegetable}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                          >
                            {item.vegetable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sides */}
                  {visit.visit_sides?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold">
                        🍳 Sides available
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {visit.visit_sides.map((item) => (
                          <span
                            key={item.side}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm"
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
                      <p className="text-gray-600">"{visit.comments}"</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function RatingBar({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: number;
}) {
  const percentage = Math.min(Math.max(value, 0), 10) * 10;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium">
          {emoji} {label}
        </p>

        <p className="font-bold">
          {value.toFixed(2)}
          <span className="font-normal text-gray-400"> / 10</span>
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
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
  value: number;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-500">
        {emoji} {label}
      </p>

      <p className="mt-1 font-bold">
        {value.toFixed(1)}
        <span className="font-normal text-gray-400"> / 10</span>
      </p>
    </div>
  );
}
