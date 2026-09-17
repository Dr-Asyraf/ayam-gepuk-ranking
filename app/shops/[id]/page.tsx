import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ShopPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShopPage({
  params,
}: ShopPageProps) {
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

  // Get visits
  const { data: visits } = await supabase
    .from("visits")
    .select(`
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
    `)
    .eq("shop_id", id)
    .order("visited_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">
          Ayam Gepuk Shop
        </p>

        <h1 className="text-4xl font-bold">
          {shop.name}
        </h1>

        {(shop.city || shop.state) && (
          <p className="mt-2 text-gray-500">
            {[shop.city, shop.state]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        {shop.address && (
          <p className="mt-1 text-gray-500">
            {shop.address}
          </p>
        )}

        {shop.description && (
          <p className="mt-4 max-w-2xl text-gray-600">
            {shop.description}
          </p>
        )}
      </div>

      {/* Overall rating */}
      <section className="mb-8 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Overall Rating
            </p>

            <p className="text-5xl font-bold">
              {ranking?.overall_rating?.toFixed(2) ?? "—"}
              <span className="ml-2 text-lg font-normal text-gray-400">
                / 10
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Visits
            </p>

            <p className="text-3xl font-bold">
              {ranking?.visit_count ?? 0}
            </p>
          </div>
        </div>
      </section>

      {/* Category ratings */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">
          Ratings
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <RatingCard
            emoji="🍗"
            title="Chicken"
            rating={ranking?.chicken_rating}
          />

          <RatingCard
            emoji="🌶️"
            title="Sambal & Kacang"
            rating={ranking?.sambal_kacang_rating}
          />

          <RatingCard
            emoji="🥬"
            title="Sayur"
            rating={ranking?.sayur_rating}
          />

          <RatingCard
            emoji="🍳"
            title="Sides"
            rating={ranking?.sides_rating}
          />
        </div>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">
          Reviews
        </h2>

        {!visits || visits.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => {
              const rating = Array.isArray(visit.ratings)
                ? visit.ratings[0]
                : visit.ratings;

              return (
                <article
                  key={visit.id}
                  className="rounded-2xl border p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-medium">
                      {new Date(
                        visit.visited_at
                      ).toLocaleDateString("en-MY")}
                    </p>

                    {rating && (
                      <p className="font-bold">
                        {(
                          (rating.chicken +
                            rating.sambal_kacang +
                            rating.sayur +
                            rating.sides) /
                          4
                        ).toFixed(2)}
                        / 10
                      </p>
                    )}
                  </div>

                  {rating && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p>
                        🍗 Chicken:{" "}
                        {rating.chicken}/10
                      </p>

                      <p>
                        🌶️ Sambal:{" "}
                        {rating.sambal_kacang}/10
                      </p>

                      <p>
                        🥬 Sayur:{" "}
                        {rating.sayur}/10
                      </p>

                      <p>
                        🍳 Sides:{" "}
                        {rating.sides}/10
                      </p>
                    </div>
                  )}

                  {visit.visit_vegetables?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">
                        Vegetables
                      </p>

                      <div className="mt-1 flex flex-wrap gap-2">
                        {visit.visit_vegetables.map(
                          (item) => (
                            <span
                              key={item.vegetable}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                            >
                              {item.vegetable}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {visit.visit_sides?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">
                        Sides available
                      </p>

                      <div className="mt-1 flex flex-wrap gap-2">
                        {visit.visit_sides.map(
                          (item) => (
                            <span
                              key={item.side}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                            >
                              {item.side}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {visit.comments && (
                    <p className="mt-4 text-gray-600">
                      "{visit.comments}"
                    </p>
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

function RatingCard({
  emoji,
  title,
  rating,
}: {
  emoji: string;
  title: string;
  rating: number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {emoji} {title}
        </p>

        <p className="text-xl font-bold">
          {rating?.toFixed(2) ?? "—"}
          <span className="text-sm font-normal text-gray-400">
            /10
          </span>
        </p>
      </div>
    </div>
  );
}