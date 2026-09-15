import ShopForm from "@/components/admin/ShopForm";

export default function NewShopPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Add Shop
      </h1>

      <p className="mb-8 text-gray-500">
        Add a new ayam gepuk shop.
      </p>

      <ShopForm />
    </main>
  );
}