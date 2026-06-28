import { useState, useMemo } from "react";
import { formatWithEUR } from "../../lib/format";

interface Props {
  countryKey: "uae" | "qatar" | "saudi";
  currency: string;
}

type ApartmentSize = "studio" | "1br" | "2br" | "3br" | "villa";
type InternetTier = "basic" | "fast" | "premium";

const sizeLabels: Record<ApartmentSize, string> = {
  studio: "Studio",
  "1br": "1 Bedroom",
  "2br": "2 Bedrooms",
  "3br": "3 Bedrooms",
  villa: "Villa",
};

const internetLabels: Record<InternetTier, string> = {
  basic: "Basic (50-100 Mbps)",
  fast: "Fast (250-500 Mbps)",
  premium: "Premium (1 Gbps+)",
};

const citiesMap: Record<string, { slug: string; name: string }[]> = {
  uae: [{ slug: "dubai", name: "Dubai" }, { slug: "abu-dhabi", name: "Abu Dhabi" }],
  qatar: [{ slug: "doha", name: "Doha" }],
  saudi: [{ slug: "riyadh", name: "Riyadh" }, { slug: "jeddah", name: "Jeddah" }, { slug: "dammam", name: "Dammam" }],
};

// Monthly costs in local currency
const elecWater: Record<string, Record<ApartmentSize, number>> = {
  dubai: { studio: 400, "1br": 550, "2br": 750, "3br": 950, villa: 1400 },
  "abu-dhabi": { studio: 350, "1br": 480, "2br": 650, "3br": 820, villa: 1200 },
  doha: { studio: 250, "1br": 350, "2br": 500, "3br": 650, villa: 900 },
  riyadh: { studio: 200, "1br": 320, "2br": 480, "3br": 620, villa: 900 },
  jeddah: { studio: 180, "1br": 300, "2br": 450, "3br": 580, villa: 850 },
  dammam: { studio: 170, "1br": 280, "2br": 420, "3br": 540, villa: 780 },
};

const internetCosts: Record<string, Record<InternetTier, number>> = {
  dubai: { basic: 299, fast: 399, premium: 549 },
  "abu-dhabi": { basic: 299, fast: 399, premium: 549 },
  doha: { basic: 300, fast: 400, premium: 500 },
  riyadh: { basic: 200, fast: 300, premium: 400 },
  jeddah: { basic: 200, fast: 300, premium: 400 },
  dammam: { basic: 180, fast: 280, premium: 380 },
};

const mobileCosts: Record<string, number> = {
  dubai: 150,
  "abu-dhabi": 150,
  doha: 130,
  riyadh: 120,
  jeddah: 120,
  dammam: 110,
};

export default function UtilitiesCostEstimator({ countryKey, currency }: Props) {
  const countryCities = citiesMap[countryKey] || [];
  const [citySlug, setCitySlug] = useState(countryCities[0]?.slug || "");
  const [size, setSize] = useState<ApartmentSize>("1br");
  const [internet, setInternet] = useState<InternetTier>("fast");

  const breakdown = useMemo(() => {
    const ew = elecWater[citySlug]?.[size] ?? 0;
    const net = internetCosts[citySlug]?.[internet] ?? 0;
    const mob = mobileCosts[citySlug] ?? 0;
    return { elecWater: ew, internet: net, mobile: mob, total: ew + net + mob };
  }, [citySlug, size, internet]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Utilities Cost Estimator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
          <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {countryCities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Apartment Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value as ApartmentSize)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(sizeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Internet Plan</label>
          <select value={internet} onChange={(e) => setInternet(e.target.value as InternetTier)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(internetLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Electricity & Water</span>
          <span className="tabular-nums font-medium text-gray-900 dark:text-white">{formatWithEUR(breakdown.elecWater, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Internet</span>
          <span className="tabular-nums font-medium text-gray-900 dark:text-white">{formatWithEUR(breakdown.internet, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Mobile (avg plan)</span>
          <span className="tabular-nums font-medium text-gray-900 dark:text-white">{formatWithEUR(breakdown.mobile, currency)}</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total monthly utilities</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatWithEUR(breakdown.total, currency)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Annual</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{formatWithEUR(breakdown.total * 12, currency)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Summer months (May-Oct) typically add 30-50% to electricity costs due to air conditioning.</p>
    </div>
  );
}
