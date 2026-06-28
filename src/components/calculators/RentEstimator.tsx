import { useState, useMemo } from "react";
import { formatWithEUR } from "../../lib/format";

interface Props {
  countryKey: "uae" | "qatar" | "saudi";
  currency: string;
}

type PropertyType = "studio" | "1br" | "2br" | "3br" | "villa";
type AreaTier = "budget" | "mid" | "premium";

const propertyLabels: Record<PropertyType, string> = {
  studio: "Studio",
  "1br": "1 Bedroom",
  "2br": "2 Bedrooms",
  "3br": "3 Bedrooms",
  villa: "Villa",
};

const cities: Record<string, { slug: string; name: string }[]> = {
  uae: [{ slug: "dubai", name: "Dubai" }, { slug: "abu-dhabi", name: "Abu Dhabi" }],
  qatar: [{ slug: "doha", name: "Doha" }],
  saudi: [{ slug: "riyadh", name: "Riyadh" }, { slug: "jeddah", name: "Jeddah" }, { slug: "dammam", name: "Dammam" }],
};

// Monthly rent in local currency [min, max] by city, property, tier
const rentData: Record<string, Record<PropertyType, Record<AreaTier, [number, number]>>> = {
  dubai: {
    studio: { budget: [3500, 4500], mid: [4500, 5500], premium: [5500, 6500] },
    "1br": { budget: [5000, 6500], mid: [6500, 8000], premium: [8000, 11000] },
    "2br": { budget: [7000, 9000], mid: [9000, 12000], premium: [12000, 16000] },
    "3br": { budget: [10000, 13000], mid: [13000, 17000], premium: [17000, 25000] },
    villa: { budget: [12000, 16000], mid: [16000, 22000], premium: [22000, 35000] },
  },
  "abu-dhabi": {
    studio: { budget: [2500, 3500], mid: [3500, 4500], premium: [4500, 5500] },
    "1br": { budget: [3500, 5000], mid: [5000, 6500], premium: [6500, 8500] },
    "2br": { budget: [5500, 7500], mid: [7500, 9500], premium: [9500, 13000] },
    "3br": { budget: [8000, 10500], mid: [10500, 14000], premium: [14000, 20000] },
    villa: { budget: [10000, 14000], mid: [14000, 19000], premium: [19000, 28000] },
  },
  doha: {
    studio: { budget: [3000, 3800], mid: [3800, 4500], premium: [4500, 5500] },
    "1br": { budget: [4500, 5500], mid: [5500, 6500], premium: [6500, 8000] },
    "2br": { budget: [6000, 7500], mid: [7500, 9000], premium: [9000, 12000] },
    "3br": { budget: [8000, 10000], mid: [10000, 13000], premium: [13000, 18000] },
    villa: { budget: [10000, 13000], mid: [13000, 17000], premium: [17000, 24000] },
  },
  riyadh: {
    studio: { budget: [1500, 2000], mid: [2000, 2600], premium: [2600, 3200] },
    "1br": { budget: [2500, 3200], mid: [3200, 4200], premium: [4200, 5500] },
    "2br": { budget: [4000, 5500], mid: [5500, 7000], premium: [7000, 9000] },
    "3br": { budget: [6000, 8000], mid: [8000, 11000], premium: [11000, 15000] },
    villa: { budget: [8000, 11000], mid: [11000, 15000], premium: [15000, 22000] },
  },
  jeddah: {
    studio: { budget: [1200, 1700], mid: [1700, 2200], premium: [2200, 2800] },
    "1br": { budget: [2000, 2800], mid: [2800, 3500], premium: [3500, 4500] },
    "2br": { budget: [3500, 4800], mid: [4800, 6000], premium: [6000, 8000] },
    "3br": { budget: [5000, 7000], mid: [7000, 10000], premium: [10000, 14000] },
    villa: { budget: [7000, 10000], mid: [10000, 14000], premium: [14000, 20000] },
  },
  dammam: {
    studio: { budget: [1000, 1500], mid: [1500, 1900], premium: [1900, 2400] },
    "1br": { budget: [1800, 2400], mid: [2400, 3000], premium: [3000, 3800] },
    "2br": { budget: [3000, 4000], mid: [4000, 5200], premium: [5200, 6500] },
    "3br": { budget: [4500, 6000], mid: [6000, 8000], premium: [8000, 11000] },
    villa: { budget: [6000, 8500], mid: [8500, 11000], premium: [11000, 16000] },
  },
};

export default function RentEstimator({ countryKey, currency }: Props) {
  const countryCities = cities[countryKey] || [];
  const [citySlug, setCitySlug] = useState(countryCities[0]?.slug || "");
  const [property, setProperty] = useState<PropertyType>("1br");
  const [area, setArea] = useState<AreaTier>("mid");

  const range = useMemo(() => {
    return rentData[citySlug]?.[property]?.[area] ?? [0, 0];
  }, [citySlug, property, area]);

  const midpoint = Math.round((range[0] + range[1]) / 2);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Rent Estimator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
          <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {countryCities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
          <select value={property} onChange={(e) => setProperty(e.target.value as PropertyType)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(propertyLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Area</label>
          <select value={area} onChange={(e) => setArea(e.target.value as AreaTier)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <option value="budget">Budget Area</option>
            <option value="mid">Mid-Range Area</option>
            <option value="premium">Premium Area</option>
          </select>
        </div>
      </div>
      <div className="flex items-baseline justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Monthly rent range</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {formatWithEUR(range[0], currency)} – {formatWithEUR(range[1], currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Annual estimate</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatWithEUR(midpoint * 12, currency)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Based on 2026 market averages. Actual rents vary by building, landlord, and lease terms.</p>
    </div>
  );
}
