"use client";

import { useMemo, useState } from "react";
import RankingCard from "./RankingCard";

type Shop = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  image_url: string | null;
  overall_rating: number | string;
  chicken_rating: number | string;
  sambal_kacang_rating: number | string;
  sayur_rating: number | string;
  sides_rating: number | string;
  visit_count: number | string;
  last_visited_at: string | null;
};

type RankingListProps = {
  shops: Shop[];
};

export default function RankingList({ shops }: RankingListProps) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const states = useMemo(() => {
    return Array.from(
      new Set(shops.map((shop) => shop.state).filter(Boolean)),
    ).sort();
  }, [shops]);

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        shops
          .filter((shop) => !stateFilter || shop.state === stateFilter)
          .map((shop) => shop.city)
          .filter(Boolean),
      ),
    ).sort();
  }, [shops, stateFilter]);

  const filteredShops = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return shops.filter((shop) => {
      const matchesSearch =
        !searchTerm || shop.name.toLowerCase().includes(searchTerm);

      const matchesState = !stateFilter || shop.state === stateFilter;

      const matchesCity = !cityFilter || shop.city === cityFilter;

      return matchesSearch && matchesState && matchesCity;
    });
  }, [shops, search, stateFilter, cityFilter]);

  const getOriginalRank = (shopId: string) => {
    return shops.findIndex((shop) => shop.id === shopId) + 1;
  };

  const handleStateChange = (value: string) => {
    setStateFilter(value);

    // Reset city when state changes
    setCityFilter("");
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            >
              🔎
            </span>

            <input
              id="search"
              type="text"
              aria-label="Search shops"
              placeholder="Search shops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white dark:border-stone-700 dark:bg-stone-800 dark:focus:bg-stone-900"
            />
          </div>

          {/* State */}
          <select
            id="state"
            aria-label="Filter by state"
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
            className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 dark:border-stone-700 dark:bg-stone-800"
          >
            <option value="">All states</option>

            {states.map((state) => (
              <option key={state} value={state ?? ""}>
                {state}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            id="city"
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            disabled={cities.length === 0}
            className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 disabled:bg-stone-100 disabled:text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:disabled:bg-stone-700 dark:disabled:text-stone-500"
          >
            <option value="">All cities</option>

            {cities.map((city) => (
              <option key={city} value={city ?? ""}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Filter summary */}
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Showing{" "}
            <span className="font-medium text-stone-700 dark:text-stone-200">
              {filteredShops.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-stone-700 dark:text-stone-200">
              {shops.length}
            </span>{" "}
            shops
          </p>

          {(search || stateFilter || cityFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStateFilter("");
                setCityFilter("");
              }}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredShops.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center dark:bg-stone-900">
          <div className="text-4xl">🔎</div>

          <h3 className="mt-4 text-lg font-bold">No shops found</h3>

          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredShops.map((shop) => (
            <RankingCard
              key={shop.id}
              rank={getOriginalRank(shop.id)}
              id={shop.id}
              name={shop.name}
              city={shop.city}
              state={shop.state}
              imageUrl={shop.image_url}
              overallRating={Number(shop.overall_rating)}
              chickenRating={Number(shop.chicken_rating)}
              sambalKacangRating={Number(shop.sambal_kacang_rating)}
              sayurRating={Number(shop.sayur_rating)}
              sidesRating={Number(shop.sides_rating)}
              visitCount={Number(shop.visit_count)}
              lastVisitedAt={shop.last_visited_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
