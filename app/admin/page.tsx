import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: rankings, error } = await supabase
    .from("shop_rankings")
    .select("*")
    .order("overall_rating", { ascending: false });

  if (error) {
    console.error(error);

    return (
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-4 text-red-600">Failed to load rankings.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <p className="mt-1 text-gray-500">Manage your ayam gepuk rankings.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/shops"
            className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
          >
            Manage Shops
          </Link>

          <Link
            href="/admin/visits/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            + Add Review
          </Link>

          <LogoutButton />
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">Shops</p>

          <p className="mt-2 text-3xl font-bold">{rankings?.length ?? 0}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">Ranked Shops</p>

          <p className="mt-2 text-3xl font-bold">
            {rankings?.filter((shop) => shop.overall_rating !== null).length ??
              0}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">Top Rating</p>

          <p className="mt-2 text-3xl font-bold">
            {rankings?.[0]?.overall_rating ?? "-"}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold">Current Rankings</h2>

        {rankings && rankings.length > 0 ? (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Rank</th>

                  <th className="px-4 py-3 text-left">Shop</th>

                  <th className="px-4 py-3 text-left">Overall</th>

                  <th className="px-4 py-3 text-left">Chicken</th>

                  <th className="px-4 py-3 text-left">Sambal</th>

                  <th className="px-4 py-3 text-left">Sayur</th>

                  <th className="px-4 py-3 text-left">Sides</th>

                  <th className="px-4 py-3 text-left">Visits</th>
                </tr>
              </thead>

              <tbody>
                {rankings.map((shop, index) => (
                  <tr key={shop.id} className="border-t">
                    <td className="px-4 py-4 font-medium">#{index + 1}</td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{shop.name}</div>

                      <div className="text-sm text-gray-500">
                        {shop.city}, {shop.state}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {shop.overall_rating ?? "-"}
                    </td>

                    <td className="px-4 py-4">{shop.chicken_rating ?? "-"}</td>

                    <td className="px-4 py-4">
                      {shop.sambal_kacang_rating ?? "-"}
                    </td>

                    <td className="px-4 py-4">{shop.sayur_rating ?? "-"}</td>

                    <td className="px-4 py-4">{shop.sides_rating ?? "-"}</td>

                    <td className="px-4 py-4">{shop.visit_count ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border p-8 text-center">
            <p className="text-gray-500">No ranked shops yet.</p>

            <Link
              href="/admin/visits/new"
              className="mt-4 inline-block font-medium underline"
            >
              Add your first review
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
