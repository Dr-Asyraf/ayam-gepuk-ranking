import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: visits, error } = await supabase
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
    .order("visited_at", {
      ascending: false,
    });

  if (error) {
    console.error("FAILED TO LOAD REVIEWS:", error);

    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-bold">Reviews</h1>

          <p className="mt-4 text-red-600">Failed to load reviews.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <AdminNav />

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-stone-500 hover:text-stone-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold">Reviews</h1>

            <p className="mt-1 text-stone-500">
              View your Ayam Gepuk review history.
            </p>
          </div>

          <Link
            href="/admin/visits/new"
            className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Add Review
          </Link>
        </div>

        {/* Review list */}
        <div className="mt-8 space-y-5">
          {visits && visits.length > 0 ? (
            visits.map((visit) => {
              const shop = Array.isArray(visit.shops)
                ? visit.shops[0]
                : visit.shops;

              const rating = Array.isArray(visit.ratings)
                ? visit.ratings[0]
                : visit.ratings;

              const overallRating = rating
                ? (
                    (Number(rating.chicken) +
                      Number(rating.sambal_kacang) +
                      Number(rating.sayur) +
                      Number(rating.sides)) /
                    4
                  ).toFixed(2)
                : null;

              return (
                <div key={visit.id} className="rounded-2xl border bg-white p-6">
                  {/* Shop + date + overall */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {shop?.name ?? "Unknown shop"}
                      </h2>

                      <p className="mt-1 text-sm text-stone-500">
                        Visited on {formatDate(visit.visited_at)}
                      </p>
                    </div>

                    {overallRating && (
                      <div className="text-right">
                        <p className="text-3xl font-bold">{overallRating}</p>

                        <p className="text-sm text-stone-400">/ 10</p>
                      </div>
                    )}
                  </div>

                  {/* Ratings */}
                  {rating && (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Rating
                        emoji="🍗"
                        label="Chicken"
                        value={rating.chicken}
                      />

                      <Rating
                        emoji="🌶️"
                        label="Sambal & Kacang"
                        value={rating.sambal_kacang}
                      />

                      <Rating emoji="🥬" label="Sayur" value={rating.sayur} />

                      <Rating emoji="🍳" label="Sides" value={rating.sides} />
                    </div>
                  )}

                  {/* Vegetables */}
                  {visit.visit_vegetables &&
                    visit.visit_vegetables.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-medium text-stone-500">
                          Vegetables
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {visit.visit_vegetables.map((item) => (
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
                  {visit.visit_sides && visit.visit_sides.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-medium text-stone-500">Sides</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {visit.visit_sides.map((item) => (
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

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 border-t pt-5">
                    <Link
                      href={`/admin/reviews/${visit.id}/edit`}
                      className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-stone-50"
                    >
                      Edit
                    </Link>

                    <DeleteReviewButton visitId={visit.id} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <p className="text-stone-500">No reviews yet.</p>

              <Link
                href="/admin/visits/new"
                className="mt-4 inline-block rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Add your first review
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
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

function Rating({
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
      <p className="text-sm text-stone-500">
        {emoji} {label}
      </p>

      <p className="mt-1 font-bold">
        {Number(value).toFixed(2)}

        <span className="font-normal text-stone-400"> / 10</span>
      </p>
    </div>
  );
}
