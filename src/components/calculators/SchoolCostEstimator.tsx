import { useState, useMemo } from "react";
import { formatWithEUR } from "../../lib/format";

interface Props {
  countryKey: "uae" | "qatar" | "saudi";
  currency: string;
}

type Curriculum = "british" | "american" | "ib" | "indian" | "french";
type Tier = "budget" | "mid" | "premium";

const curriculumLabels: Record<Curriculum, string> = {
  british: "British",
  american: "American",
  ib: "IB (International Baccalaureate)",
  indian: "Indian (CBSE/ICSE)",
  french: "French",
};

// Annual fees per curriculum per tier per country (local currency)
const feeData: Record<string, Record<Curriculum, Record<Tier, number>>> = {
  uae: {
    british: { budget: 25000, mid: 50000, premium: 85000 },
    american: { budget: 28000, mid: 55000, premium: 90000 },
    ib: { budget: 35000, mid: 60000, premium: 95000 },
    indian: { budget: 8000, mid: 18000, premium: 30000 },
    french: { budget: 20000, mid: 35000, premium: 55000 },
  },
  qatar: {
    british: { budget: 22000, mid: 42000, premium: 65000 },
    american: { budget: 25000, mid: 45000, premium: 65000 },
    ib: { budget: 30000, mid: 50000, premium: 65000 },
    indian: { budget: 8000, mid: 16000, premium: 28000 },
    french: { budget: 18000, mid: 30000, premium: 45000 },
  },
  saudi: {
    british: { budget: 20000, mid: 38000, premium: 60000 },
    american: { budget: 22000, mid: 40000, premium: 62000 },
    ib: { budget: 28000, mid: 45000, premium: 60000 },
    indian: { budget: 6000, mid: 14000, premium: 25000 },
    french: { budget: 15000, mid: 28000, premium: 42000 },
  },
};

export default function SchoolCostEstimator({ countryKey, currency }: Props) {
  const [curriculum, setCurriculum] = useState<Curriculum>("british");
  const [tier, setTier] = useState<Tier>("mid");
  const [numChildren, setNumChildren] = useState(1);

  const annualPerChild = useMemo(() => {
    return feeData[countryKey]?.[curriculum]?.[tier] ?? 0;
  }, [countryKey, curriculum, tier]);

  const totalAnnual = annualPerChild * numChildren;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">School Fee Estimator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Curriculum</label>
          <select value={curriculum} onChange={(e) => setCurriculum(e.target.value as Curriculum)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {Object.entries(curriculumLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">School Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value as Tier)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <option value="budget">Budget</option>
            <option value="mid">Mid-Range</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Children</label>
          <select value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-baseline justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Annual per child</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{formatWithEUR(annualPerChild, currency)}</p>
        </div>
        {numChildren > 1 && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total ({numChildren} children)</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatWithEUR(totalAnnual, currency)}</p>
          </div>
        )}
        {numChildren === 1 && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly equiv.</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">{formatWithEUR(Math.round(totalAnnual / 12), currency)}</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Estimates based on 2026 average tuition. Excludes uniforms, transport, and activity fees.</p>
    </div>
  );
}
