import ShopForm from "@/components/admin/ShopForm";
import AdminNav from "@/components/admin/AdminNav";

export default function NewShopPage() {
  return (
    <main className="min-h-screen">
      <AdminNav />

      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-2 text-3xl font-bold">Add Shop</h1>

        <p className="mb-8 text-stone-500">Add a new ayam gepuk shop.</p>

        <ShopForm />
      </div>
    </main>
  );
}