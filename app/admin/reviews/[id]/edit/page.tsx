import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import EditReviewForm from "@/components/admin/EditReviewForm";
import AdminNav from "@/components/admin/AdminNav";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: visit, error } = await supabase
    .from("visits")
    .select(
      `
      id,
      shop_id,
      visited_at,
      comments,
      shops (
        name
      ),
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
    .eq("id", id)
    .single();

  if (error || !visit) {
    console.error("FAILED TO LOAD REVIEW:", error);

    notFound();
  }

  const shop = Array.isArray(visit.shops) ? visit.shops[0] : visit.shops;

  const rating = Array.isArray(visit.ratings)
    ? visit.ratings[0]
    : visit.ratings;

  if (!rating) {
    notFound();
  }

  const vegetables =
    visit.visit_vegetables?.map((item) => item.vegetable) ?? [];

  const sides = visit.visit_sides?.map((item) => item.side) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/admin/reviews"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to reviews
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
            Edit Review
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {shop?.name ?? "Unknown shop"}
          </h1>
        </div>

        <div className="mt-8">
          <EditReviewForm
            visit={{
              id: visit.id,
              visitedAt: visit.visited_at,
              comments: visit.comments,
              chicken: Number(rating.chicken),
              sambalKacang: Number(rating.sambal_kacang),
              sayur: Number(rating.sayur),
              sides: Number(rating.sides),
              vegetables,
              selectedSides: sides,
            }}
          />
        </div>
      </div>
    </main>
  );
}
