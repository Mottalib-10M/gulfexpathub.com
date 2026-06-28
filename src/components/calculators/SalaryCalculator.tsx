import { useState, useMemo, useEffect } from "react";
import { calculateSalary, type SalaryCountry, type SalaryResult } from "../../lib/salary-engine";
import { formatDetailedWithEUR } from "../../lib/format";
import { decodeState, updateURL } from "../../lib/url-state";
import ShareButtons from "./ShareButtons";

interface Props {
  country: SalaryCountry;
  currency: string;
  countryName: string;
}

export default function SalaryCalculator({ country, currency, countryName }: Props) {
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [housingAllowance, setHousingAllowance] = useState<string>("");
  const [transportAllowance, setTransportAllowance] = useState<string>("");
  const [includeHousing, setIncludeHousing] = useState(true);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [isNational, setIsNational] = useState(false);

  // Read URL params on mount to pre-fill values
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = decodeState(window.location.search);
    if (params.salary) setMonthlySalary(params.salary);
    if (params.housing) setHousingAllowance(params.housing);
    if (params.transport) setTransportAllowance(params.transport);
    if (params.national === "1") setIsNational(true);
  }, []);

  const result: SalaryResult | null = useMemo(() => {
    const salary = parseFloat(monthlySalary);
    if (!salary || salary <= 0) return null;
    return calculateSalary({
      country,
      monthlySalary: salary,
      includeHousing,
      housingAllowance: parseFloat(housingAllowance) || 0,
      includeTransport,
      transportAllowance: parseFloat(transportAllowance) || 0,
      isNational,
    });
  }, [monthlySalary, housingAllowance, transportAllowance, includeHousing, includeTransport, isNational, country]);

  // Update URL whenever inputs change (only if salary is present)
  useEffect(() => {
    if (!monthlySalary) return;
    const params: Record<string, string> = {
      salary: monthlySalary,
      country,
    };
    if (housingAllowance) params.housing = housingAllowance;
    if (transportAllowance) params.transport = transportAllowance;
    if (isNational) params.national = "1";
    updateURL(params);
  }, [monthlySalary, housingAllowance, transportAllowance, isNational, country]);

  const shareText = result
    ? `My ${countryName} take-home salary: ${formatDetailedWithEUR(result.netMonthly, currency)}/month (${formatDetailedWithEUR(result.grossMonthly, currency)} gross). Calculate yours:`
    : "";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {countryName} Salary Calculator 2026
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Basic Monthly Salary ({currency})
            </label>
            <input
              type="text" inputMode="decimal"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setMonthlySalary(String(v)); }}
              placeholder="e.g. 15000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tabular-nums"
              min="0"
              step="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Housing Allowance ({currency})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeHousing}
                onChange={(e) => setIncludeHousing(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <input
                type="text" inputMode="decimal"
                value={housingAllowance}
                onChange={(e) => setHousingAllowance(e.target.value)}
                onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setHousingAllowance(String(v)); }}
                placeholder="e.g. 5000"
                disabled={!includeHousing}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tabular-nums disabled:opacity-50"
                min="0"
                step="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Transport Allowance ({currency})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeTransport}
                onChange={(e) => setIncludeTransport(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <input
                type="text" inputMode="decimal"
                value={transportAllowance}
                onChange={(e) => setTransportAllowance(e.target.value)}
                onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setTransportAllowance(String(v)); }}
                placeholder="e.g. 1500"
                disabled={!includeTransport}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tabular-nums disabled:opacity-50"
                min="0"
                step="100"
              />
            </div>
          </div>

          {country !== "qatar" && (
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNational}
                  onChange={(e) => setIsNational(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I am a {country === "uae" ? "UAE/GCC" : "Saudi"} national
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Gross</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                {formatDetailedWithEUR(result.grossMonthly, currency)}
              </p>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Net</p>
              <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formatDetailedWithEUR(result.netMonthly, currency)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Gross</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                {formatDetailedWithEUR(result.grossAnnual, currency)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Net</p>
              <p className="text-lg font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formatDetailedWithEUR(result.netAnnual, currency)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal-50 dark:bg-teal-900/20">
                  <th className="px-4 py-2 text-left font-semibold text-teal-800 dark:text-teal-300 rounded-tl-lg">Component</th>
                  <th className="px-4 py-2 text-right font-semibold text-teal-800 dark:text-teal-300 rounded-tr-lg">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.breakdown.map((item, i) => (
                  <tr key={i}>
                    <td className={`px-4 py-2 ${item.type === "deduction" ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                      {item.label}
                    </td>
                    <td className={`px-4 py-2 text-right tabular-nums font-medium ${item.type === "deduction" ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                      {item.type === "deduction" ? "" : ""}{formatDetailedWithEUR(Math.abs(item.amount), currency)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">Net Take-Home Pay</td>
                  <td className="px-4 py-2 text-right text-teal-600 dark:text-teal-400 tabular-nums">
                    {formatDetailedWithEUR(result.netMonthly, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {result.deductions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deductions Detail</h3>
              <div className="space-y-2">
                {result.deductions.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{d.label}</span>
                    <span className="tabular-nums text-gray-900 dark:text-white">
                      {formatDetailedWithEUR(d.monthlyAmount, currency)}/mo
                      {d.rate !== null && ` (${(d.rate * 100).toFixed(2)}%)`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-500">
            <p>Effective deduction rate: {(result.effectiveTaxRate * 100).toFixed(2)}% of gross salary</p>
            {country === "qatar" && <p>Qatar has no personal income tax and no social security contributions for expatriates.</p>}
            {country === "uae" && <p>The UAE has no personal income tax. Social security applies only to UAE/GCC nationals.</p>}
            {country === "saudi" && <p>Saudi Arabia has no personal income tax. GOSI contributions apply to nationals (9.75%) and employers of expats (2%).</p>}
          </div>

          <ShareButtons text={shareText} />
        </div>
      )}
    </div>
  );
}
