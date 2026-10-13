import Link from "next/link";
import Image from "next/image";
import { formatVisitDate } from "@/lib/dates";

type RankingCardProps = {
  rank: number;
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  overallRating: number;
  chickenRating: number;
  sambalKacangRating: number;
  sayurRating: number;
  sidesRating: number;
  visitCount: number;
  lastVisitedAt: string | null;
};

export default function RankingCard({
  rank,
  id,
  name,
  city,
  state,
  imageUrl,
  overallRating,
  chickenRating,
  sambalKacangRating,
  sayurRating,
  sidesRating,
  visitCount,
  lastVisitedAt,
}: RankingCardProps) {
  const rankBadgeStyle =
    rank === 1
      ? "bg-amber-400 text-stone-950"
      : rank === 2
        ? "bg-stone-200 text-stone-900"
        : rank === 3
          ? "bg-orange-300 text-stone-950"
          : "bg-stone-900/85 text-white backdrop-blur";

  const cardBodyStyle =
    rank === 1
      ? "border-amber-300 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-950/40"
      : rank === 2
        ? "border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800"
        : rank === 3
          ? "border-orange-300 bg-orange-50 dark:border-orange-500/50 dark:bg-orange-950/40"
          : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900";

  return (
    <Link
      href={`/shops/${id}`}
      className="group relative block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
    >
      {/* Rank badge */}
      <span
        className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider shadow-md ${rankBadgeStyle}`}
      >
        Rank #{rank}
      </span>

      {/* Image */}
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={imageUrl}
            alt={name}
            fill
            preload={rank === 1}
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-stone-100 dark:bg-stone-800">
          <div className="text-center">
            <div className="text-5xl">🍗</div>

            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              No photo available
            </p>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className={`rounded-b-2xl border-t p-6 ${cardBodyStyle}`}>
        {/* Top section */}
        <div className="flex items-start justify-between gap-4">
          {/* Shop information */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {name}
            </h2>

            {(city || state) && (
              <p className="mt-1 text-sm font-semibold text-stone-600 dark:text-stone-400">
                {[city, state].filter(Boolean).join(", ")}
              </p>
            )}

            <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-400">
              {visitCount} {visitCount === 1 ? "visit" : "visits"}

              {lastVisitedAt &&
                ` · Last visited ${formatVisitDate(lastVisitedAt)}`}
            </p>
          </div>

          {/* Overall rating */}
          <div className="shrink-0 text-right">
            <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {overallRating.toFixed(2)}
            </p>

            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              / 10
            </p>
          </div>
        </div>

        {/* Category ratings */}
        <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Rating emoji="🍗" label="Chicken" value={chickenRating} />

          <Rating
            emoji="🌶️"
            label="Sambal & Kacang"
            value={sambalKacangRating}
          />

          <Rating emoji="🥬" label="Sayur" value={sayurRating} />

          <Rating emoji="🍳" label="Sides" value={sidesRating} />
        </div>

        {/* Details link */}
        <div className="mt-5 border-t pt-4">
          <p className="text-sm font-semibold text-stone-600 transition-colors group-hover:text-amber-600 dark:text-stone-400 dark:group-hover:text-amber-400">
            View shop details →
          </p>
        </div>
      </div>
    </Link>
  );
}

function Rating({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs dark:border-stone-700 dark:bg-stone-800/80">
      <p className="flex items-center gap-2 font-semibold text-stone-700 dark:text-stone-300">
        <span>{emoji}</span> {label}
      </p>

      <p className="font-bold text-stone-900 dark:text-stone-100">
        {value.toFixed(2)}
        <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
          {" "}
          / 10
        </span>
      </p>
    </div>
  );
}
