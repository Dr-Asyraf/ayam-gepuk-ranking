import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ShopForm from "@/components/admin/ShopForm";

type EditShopPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditShopPage({
  params,
}: EditShopPageProps) {
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
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Edit Shop
      </h1>

      <p className="mb-8 text-gray-500">
        Update the shop information.
      </p>

      <ShopForm shop={shop} />
    </main>
  );
}