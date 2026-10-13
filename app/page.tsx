import RankingList from "@/components/rankings/RankingList";
import Header from "@/components/layout/Header";
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
      <>
        <Header />
        <main className="min-h-screen bg-stone-50 px-6 py-10 dark:bg-stone-950">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Ayam Gepuk Rankings
            </h1>

            <p className="mt-4 text-red-500 dark:text-red-400">
              Failed to load rankings.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-6 py-10 md:px-12">
          {/* Hero */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              One Man&apos;s Search For The Best Gepuk
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl md:text-5xl dark:text-stone-100">
              Asyraf&apos;s Ayam Gepuk Rankings 🍗
            </h1>

            <p className="mt-3 font-medium text-stone-600 dark:text-stone-400">
              Ranking my favourite ayam gepuk shops
            </p>
          </div>

          {/* Search, filters & rankings */}
          <RankingList shops={shops ?? []} />
        </div>
      </main>
    </>
  );
}
