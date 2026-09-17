import { createClient } from "@/lib/supabase/server";
import RankingCard from "@/components/rankings/RankingCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: shops, error } = await supabase
    .from("shop_rankings")
    .select("*")
    .order("overall_rating", { ascending: false });

  if (error) {
    console.error(error);

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-3xl font-bold">Ayam Gepuk Rankings</h1>

          <p className="mt-3 text-gray-500">Failed to load rankings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="text-5xl">🍗</div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ayam Gepuk Rankings
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Finding the best ayam gepuk, one plate at a time.
          </p>

          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
            Ranked based on chicken, sambal & kacang, vegetables, and sides.
          </p>
        </div>
      </section>

      {/* Rankings */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">🏆 Current Rankings</h2>

          <p className="mt-1 text-sm text-gray-500">
            {shops?.length ?? 0} {shops?.length === 1 ? "shop" : "shops"} ranked
          </p>
        </div>

        {!shops || shops.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
            <div className="text-4xl">🍗</div>

            <h3 className="mt-4 text-lg font-bold">No rankings yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Reviews need to be added before shops appear in the rankings.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {shops.map((shop, index) => (
              <RankingCard
                key={shop.id}
                rank={index + 1}
                id={shop.id}
                name={shop.name}
                city={shop.city}
                state={shop.state}
                overallRating={Number(shop.overall_rating)}
                chickenRating={Number(shop.chicken_rating)}
                sambalKacangRating={Number(shop.sambal_kacang_rating)}
                sayurRating={Number(shop.sayur_rating)}
                sidesRating={Number(shop.sides_rating)}
                visitCount={Number(shop.visit_count)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Scoring explanation */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-xl font-bold">📊 How the rankings work</h2>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Every shop is scored across four categories. Each category
            contributes equally to the overall rating.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreItem emoji="🍗" title="Chicken" percentage="25%" />

            <ScoreItem emoji="🌶️" title="Sambal & Kacang" percentage="25%" />

            <ScoreItem emoji="🥬" title="Sayur" percentage="25%" />

            <ScoreItem emoji="🍳" title="Sides" percentage="25%" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ScoreItem({
  emoji,
  title,
  percentage,
}: {
  emoji: string;
  title: string;
  percentage: string;
}) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-5">
      <div className="text-2xl">{emoji}</div>

      <p className="mt-3 font-semibold">{title}</p>

      <p className="mt-1 text-sm text-gray-500">
        {percentage} of overall score
      </p>
    </div>
  );
}
