import { useState, useMemo } from "react";
import { formatWithEUR } from "../../lib/format";

interface Props {
  countryKey: "uae" | "qatar" | "saudi";
  currency: string;
}

type Mode = "public" | "car" | "rideshare" | "mixed";
type CommuteDistance = "short" | "medium" | "long";

const modeLabels: Record<Mode, string> = {
  public: "Public Transport Only",
  car: "Own Car",
  rideshare: "Ride-hailing (Uber/Careem)",
  mixed: "Mixed (Public + Occasional Car)",
};

const distanceLabels: Record<CommuteDistance, string> = {
  short: "Short (< 10 km)",
  medium: "Medium (10-25 km)",
  long: "Long (25+ km)",
};

const citiesMap: Record<string, { slug: string; name: string }[]> = {
  uae: [{ slug: "dubai", name: "Dubai" }, { slug: "abu-dhabi", name: "Abu Dhabi" }],
  qatar: [{ slug: "doha", name: "Doha" }],
  saudi: [{ slug: "riyadh", name: "Riyadh" }, { slug: "jeddah", name: "Jeddah" }, { slug: "dammam", name: "Dammam" }],
};

// Monthly costs by city, mode, distance (local currency)
const costData: Record<string, Record<Mode, Record<CommuteDistance, number>>> = {
  dubai: {
    public: { short: 300, medium: 350, long: 400 },
    car: { short: 800, medium: 1200, long: 1600 },
    rideshare: { short: 600, medium: 1500, long: 2500 },
    mixed: { short: 450, medium: 700, long: 1000 },
  },
  "abu-dhabi": {
    public: { short: 200, medium: 250, long: 350 },
    car: { short: 700, medium: 1100, long: 1500 },
    rideshare: { short: 500, medium: 1300, long: 2200 },
    mixed: { short: 400, medium: 650, long: 900 },
  },
  doha: {
    public: { short: 200, medium: 250, long: 300 },
    car: { short: 600, medium: 900, long: 1200 },
    rideshare: { short: 500, medium: 1200, long: 2000 },
    mixed: { short: 350, medium: 550, long: 800 },
  },
  riyadh: {
    public: { short: 140, medium: 180, long: 250 },
    car: { short: 600, medium: 900, long: 1300 },
    rideshare: { short: 500, medium: 1200, long: 2000 },
    mixed: { short: 350, medium: 550, long: 800 },
  },
  jeddah: {
    public: { short: 100, medium: 150, long: 200 },
    car: { short: 550, medium: 850, long: 1200 },
    rideshare: { short: 450, medium: 1100, long: 1800 },
    mixed: { short: 300, medium: 500, long: 750 },
  },
  dammam: {
    public: { short: 80, medium: 120, long: 180 },
    car: { short: 500, medium: 800, long: 1100 },
    rideshare: { short: 400, medium: 1000, long: 1600 },
    mixed: { short: 280, medium: 450, long: 700 },
  },
};

export default function TransportCostEstimator({ countryKey, currency }: Props) {
  const countryCities = citiesMap[countryKey] || [];
  const [citySlug, setCitySlug] = useState(countryCities[0]?.slug || "");
  const [mode, setMode] = useState<Mode>("mixed");
  const [distance, setDistance] = useState<CommuteDistance>("medium");

  const monthly = useMemo(() => {
    return costData[citySlug]?.[mode]?.[distance] ?? 0;
  }, [citySlug, mode, distance]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Transport Cost Estimator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
          <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {countryCities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Transport Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(modeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Commute Distance</label>
          <select value={distance} onChange={(e) => setDistance(e.target.value as CommuteDistance)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(distanceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-baseline justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Estimated monthly cost</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatWithEUR(monthly, currency)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Annual estimate</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{formatWithEUR(monthly * 12, currency)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Includes fuel, insurance, parking, or pass costs. Ride-hailing estimates assume 20 work days/month.</p>
    </div>
  );
}
