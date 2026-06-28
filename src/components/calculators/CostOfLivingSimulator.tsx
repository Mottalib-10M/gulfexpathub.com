import { useState, useMemo, useEffect } from "react";
import {
  simulateCost,
  compareWithOrigin,
  getAvailableCities,
  getOriginCityOptions,
  type HousingType,
  type TransportMode,
  type HealthcareTier,
  type Lifestyle,
} from "../../lib/cost-simulator-engine";
import { formatWithEUR, formatUSD, formatPercent } from "../../lib/format";
import { decodeState, updateURL } from "../../lib/url-state";
import ShareButtons from "./ShareButtons";

interface Props {
  defaultCity?: string;
  defaultOrigin?: string;
}

const housingLabels: Record<HousingType, string> = {
  studio: "Studio",
  "1br": "1 Bedroom",
  "2br": "2 Bedrooms",
  "3br": "3 Bedrooms",
  villa: "Villa",
};

const transportLabels: Record<TransportMode, string> = {
  public: "Public Transport",
  car: "Own Car",
  mixed: "Mixed",
};

const healthcareLabels: Record<HealthcareTier, string> = {
  basic: "Basic (employer plan)",
  premium: "Premium (top-up)",
};

const lifestyleLabels: Record<Lifestyle, string> = {
  budget: "Budget",
  comfort: "Comfortable",
  premium: "Premium",
};

export default function CostOfLivingSimulator({ defaultCity, defaultOrigin }: Props) {
  const cities = useMemo(() => getAvailableCities(), []);
  const origins = useMemo(() => getOriginCityOptions(), []);

  const [citySlug, setCitySlug] = useState(defaultCity || cities[0]?.slug || "dubai");
  const [housing, setHousing] = useState<HousingType>("1br");
  const [transport, setTransport] = useState<TransportMode>("mixed");
  const [healthcare, setHealthcare] = useState<HealthcareTier>("basic");
  const [children, setChildren] = useState(0);
  const [lifestyle, setLifestyle] = useState<Lifestyle>("comfort");
  const [originSlug, setOriginSlug] = useState(defaultOrigin || "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = decodeState(window.location.search);
    if (p.city) setCitySlug(p.city);
    if (p.housing && p.housing in housingLabels) setHousing(p.housing as HousingType);
    if (p.transport && p.transport in transportLabels) setTransport(p.transport as TransportMode);
    if (p.healthcare && p.healthcare in healthcareLabels) setHealthcare(p.healthcare as HealthcareTier);
    if (p.children) setChildren(parseInt(p.children) || 0);
    if (p.lifestyle && p.lifestyle in lifestyleLabels) setLifestyle(p.lifestyle as Lifestyle);
    if (p.origin) setOriginSlug(p.origin);
  }, []);

  const result = useMemo(() => simulateCost({ citySlug, housing, transport, healthcare, children, lifestyle }), [citySlug, housing, transport, healthcare, children, lifestyle]);

  const comparison = useMemo(() => {
    if (!result || !originSlug) return null;
    return compareWithOrigin(result, originSlug);
  }, [result, originSlug]);

  useEffect(() => {
    if (!result) return;
    const params: Record<string, string> = { city: citySlug, housing, transport, healthcare, children: String(children), lifestyle };
    if (originSlug) params.origin = originSlug;
    updateURL(params);
  }, [citySlug, housing, transport, healthcare, children, lifestyle, originSlug, result]);

  const shareText = result
    ? `My estimated monthly cost of living in ${result.cityName}: ${formatWithEUR(result.total, result.currency)}. Calculate yours:`
    : "";

  const breakdownRows = result
    ? [
        { label: "Housing", value: result.housing, color: "bg-teal-500" },
        { label: "Food & Dining", value: result.food, color: "bg-amber-500" },
        { label: "Transport", value: result.transport, color: "bg-blue-500" },
        { label: "Healthcare", value: result.healthcare, color: "bg-red-400" },
        { label: "Education", value: result.education, color: "bg-purple-500" },
        { label: "Utilities", value: result.utilities, color: "bg-cyan-500" },
        { label: "Other", value: result.other, color: "bg-gray-400" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Cost of Living Simulator
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
            <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Housing</label>
            <select value={housing} onChange={(e) => setHousing(e.target.value as HousingType)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {Object.entries(housingLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Transport</label>
            <select value={transport} onChange={(e) => setTransport(e.target.value as TransportMode)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {Object.entries(transportLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Healthcare</label>
            <select value={healthcare} onChange={(e) => setHealthcare(e.target.value as HealthcareTier)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {Object.entries(healthcareLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Children</label>
            <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? "None" : n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Lifestyle</label>
            <select value={lifestyle} onChange={(e) => setLifestyle(e.target.value as Lifestyle)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              {Object.entries(lifestyleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Compare with</label>
            <select value={originSlug} onChange={(e) => setOriginSlug(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">-- Select origin city --</option>
              {origins.map((o) => <option key={o.slug} value={o.slug}>{o.name}, {o.country}</option>)}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estimated monthly cost in {result.cityName}</p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formatWithEUR(result.total, result.currency)}
              </p>
            </div>
            {comparison && (
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">vs {comparison.origin.cityName}</p>
                <p className={`text-lg font-bold tabular-nums ${comparison.deltaPercent > 0 ? "text-red-500" : "text-green-600"}`}>
                  {comparison.deltaPercent > 0 ? "+" : ""}{formatPercent(comparison.deltaPercent)}
                </p>
                <p className="text-xs text-gray-500 tabular-nums">
                  ({comparison.deltaUSD > 0 ? "+" : ""}{formatUSD(comparison.deltaUSD)}/mo)
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {breakdownRows.map((row) => {
              const pct = result.total > 0 ? (row.value / result.total) * 100 : 0;
              return (
                <div key={row.label} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-gray-600 dark:text-gray-400 shrink-0">{row.label}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <span className="w-24 text-right tabular-nums font-medium text-gray-900 dark:text-white">
                    {formatWithEUR(row.value, result.currency)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            Estimates based on 2026 market averages. Actual costs vary by area, provider, and spending habits.
          </p>

          <ShareButtons text={shareText} />
        </div>
      )}
    </div>
  );
}
