import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-stone-900/80">
      <div className="flex items-center justify-between px-6 py-3.5 md:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-stone-900 transition-colors dark:text-stone-100"
        >
          <span className="text-2xl">🍗</span>

          <span className="hidden sm:inline">Ayam Gepuk Rankings</span>

          <span className="sm:hidden">Ayam Gepuk</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
