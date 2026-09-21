import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/shops", label: "Shops" },
  { href: "/admin/shops/new", label: "Add Shop" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminNav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 py-3">
        <Link href="/admin" className="mr-4 text-sm font-bold">
          Ayam Gepuk Admin
        </Link>

        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}