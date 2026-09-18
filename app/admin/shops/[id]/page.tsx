import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import EditShopForm from "@/components/admin/EditShopForm";
import PhotoUploader from "@/components/admin/PhotoUploader";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminShopPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !shop) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Back */}
        <Link
          href="/admin/shops"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to shops
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
            Manage Shop
          </p>

          <h1 className="mt-2 text-3xl font-bold">{shop.name}</h1>
        </div>

        {/* Edit shop */}
        <div className="mt-8">
          <EditShopForm
            shop={{
              id: shop.id,
              name: shop.name,
              address: shop.address,
              city: shop.city,
              state: shop.state,
              description: shop.description,
            }}
          />
        </div>

        {/* Photo */}
        <div className="mt-6">
          <PhotoUploader shopId={shop.id} />
        </div>
      </div>
    </main>
  );
}
