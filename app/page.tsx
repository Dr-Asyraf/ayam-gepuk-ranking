import RankingCard from "@/components/rankings/RankingCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: shops, error } = await supabase
    .from("shop_rankings")
    .select("*")
    .order("overall_rating", {
      ascending: false,
    });

  if (error) {
    console.error(error);

    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold">Ayam Gepuk Rankings</h1>

          <p className="mt-4 text-red-500">Failed to load rankings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Asyraf's Ayam Gepuk Rankings
          </p>

          <h1 className="mt-2 text-4xl font-bold">Ayam Gepuk Rankings 🍗</h1>

          <p className="mt-3 text-stone-500">
            Ranking my favourite ayam gepuk shops based on my visits and
            ratings.
          </p>
        </div>

        {/* Rankings */}
        <div className="mt-8 space-y-5">
          {shops && shops.length > 0 ? (
            shops.map((shop, index) => (
              <RankingCard
                key={shop.id}
                rank={index + 1}
                id={shop.id}
                name={shop.name}
                city={shop.city}
                state={shop.state}
                imageUrl={shop.image_url}
                overallRating={Number(shop.overall_rating)}
                chickenRating={Number(shop.chicken_rating)}
                sambalKacangRating={Number(shop.sambal_kacang_rating)}
                sayurRating={Number(shop.sayur_rating)}
                sidesRating={Number(shop.sides_rating)}
                visitCount={Number(shop.visit_count)}
              />
            ))
          ) : (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <p className="text-stone-500">No ranked shops yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
