import Link from "next/link";

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
}: RankingCardProps) {
  const rankStyle =
    rank === 1
      ? "border-yellow-300 bg-yellow-50"
      : rank === 2
        ? "border-gray-300 bg-gray-50"
        : rank === 3
          ? "border-orange-300 bg-orange-50"
          : "border-gray-200 bg-white";

  const rankEmoji =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <Link
      href={`/shops/${id}`}
      className="block overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      {imageUrl ? (
        <div className="aspect-[16/7] w-full overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/7] w-full items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-5xl">🍗</div>

            <p className="mt-2 text-sm text-gray-400">No photo available</p>
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        className={`rounded-b-2xl border-t p-6 transition hover:-translate-y-1 hover:shadow-lg ${rankStyle}`}
      >
        {/* Top section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Rank */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm">
              {rankEmoji}
            </div>

            {/* Shop information */}
            <div>
              <h2 className="text-xl font-bold">{name}</h2>

              {(city || state) && (
                <p className="mt-1 text-sm text-gray-500">
                  {[city, state].filter(Boolean).join(", ")}
                </p>
              )}

              <p className="mt-1 text-sm text-gray-500">
                {visitCount} {visitCount === 1 ? "visit" : "visits"}
              </p>
            </div>
          </div>

          {/* Overall rating */}
          <div className="text-right">
            <p className="text-4xl font-bold">{overallRating.toFixed(2)}</p>

            <p className="text-sm text-gray-400">/ 10</p>
          </div>
        </div>

        {/* Category ratings */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
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
          <p className="text-sm font-medium text-gray-500">
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
    <div className="rounded-xl bg-white/80 p-3">
      <p className="text-gray-500">
        {emoji} {label}
      </p>

      <p className="mt-1 font-bold">
        {value.toFixed(2)}
        <span className="font-normal text-gray-400"> / 10</span>
      </p>
    </div>
  );
}
