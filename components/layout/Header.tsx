import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-2xl">🍗</span>

          <span className="hidden sm:inline">Ayam Gepuk Rankings</span>

          <span className="sm:hidden">Ayam Gepuk</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link
            href="/"
            className="text-stone-600 transition hover:text-stone-900"
          >
            Rankings
          </Link>
        </nav>
      </div>
    </header>
  );
}
