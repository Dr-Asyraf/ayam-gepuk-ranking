import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import PhotoManager from "@/components/admin/PhotoManager";
import AdminNav from "@/components/admin/AdminNav";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShopPhotosPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id, name")
    .eq("id", id)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("id, image_url, caption, is_primary, created_at")
    .eq("shop_id", id)
    .order("created_at", {
      ascending: false,
    });

  if (photosError) {
    console.error("FAILED TO LOAD PHOTOS:", photosError);
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <AdminNav />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/admin/shops"
          className="text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          ← Back to shops
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Shop Photos
          </p>

          <h1 className="mt-2 text-3xl font-bold">{shop.name}</h1>
        </div>

        <div className="mt-8">
          <PhotoManager shopId={shop.id} photos={photos ?? []} />
        </div>
      </div>
    </main>
  );
}
