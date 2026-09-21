import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeactivateShopButton from "@/components/admin/DeactivateShopButton";
import AdminNav from "@/components/admin/AdminNav";

export default async function ShopsPage() {
  const supabase = await createClient();

  const { data: shops, error } = await supabase
    .from("shops")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);

    return (
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-3xl font-bold">Manage Shops</h1>

        <p className="mt-4 text-red-600">Failed to load shops.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <AdminNav />

      <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Shops</h1>

          <p className="mt-1 text-gray-500">
            Add and manage your ayam gepuk shops.
          </p>
        </div>

        <Link
          href="/admin/shops/new"
          className="rounded-lg bg-black px-5 py-3 font-medium text-white"
        >
          + Add Shop
        </Link>
      </div>

      {shops && shops.length > 0 ? (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Shop</th>

                <th className="px-4 py-3 text-left">Location</th>

                <th className="px-4 py-3 text-left">Status</th>

                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-t">
                  <td className="px-4 py-4">
                    <div className="font-medium">{shop.name}</div>

                    {shop.address && (
                      <div className="text-sm text-gray-500">
                        {shop.address}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {shop.city || "-"}
                    {shop.state ? `, ${shop.state}` : ""}
                  </td>

                  <td className="px-4 py-4">
                    {shop.is_active ? (
                      <span className="font-medium text-green-600">Active</span>
                    ) : (
                      <span className="font-medium text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/shops/${shop.id}/edit`}
                        className="font-medium underline"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/admin/shops/${shop.id}`}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                      >
                        Manage
                      </Link>

                      <Link
                        href={`/admin/shops/${shop.id}/photos`}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        Photos
                      </Link>

                      {shop.is_active && (
                        <DeactivateShopButton shopId={shop.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-gray-500">No shops have been added yet.</p>

          <Link
            href="/admin/shops/new"
            className="mt-4 inline-block font-medium underline"
          >
            Add your first shop
          </Link>
        </div>
      )}
    </div>
    </main>
  );
}
