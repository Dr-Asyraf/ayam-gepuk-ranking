"use client";

import { useMemo, useState } from "react";
import RankingCard from "./RankingCard";

type Shop = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  overall_rating: number | string;
  chicken_rating: number | string;
  sambal_kacang_rating: number | string;
  sayur_rating: number | string;
  sides_rating: number | string;
  visit_count: number | string;
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
      <div className="mb-8 rounded-2xl border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="search" className="mb-2 block text-sm font-medium">
              Search shops
            </label>

            <input
              id="search"
              type="text"
              placeholder="e.g. Ayam Gepuk Pak Gembus"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-gray-400"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              State
            </label>

            <select
              id="state"
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-gray-400"
            >
              <option value="">All states</option>

              {states.map((state) => (
                <option key={state} value={state ?? ""}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City
            </label>

            <select
              id="city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              disabled={cities.length === 0}
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">All cities</option>

              {cities.map((city) => (
                <option key={city} value={city ?? ""}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter summary */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {filteredShops.length}
            </span>{" "}
            of <span className="font-medium text-gray-700">{shops.length}</span>{" "}
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
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredShops.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
          <div className="text-4xl">🔎</div>

          <h3 className="mt-4 text-lg font-bold">No shops found</h3>

          <p className="mt-2 text-sm text-gray-500">
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
              overallRating={Number(shop.overall_rating)}
              chickenRating={Number(shop.chicken_rating)}
              sambalKacangRating={Number(shop.sambal_kacang_rating)}
              sayurRating={Number(shop.sayur_rating)}
              sidesRating={Number(shop.sides_rating)}
              visitCount={Number(shop.visit_count)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
