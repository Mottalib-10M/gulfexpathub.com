import { uaeCostOfLiving } from "../data/uae/cost-of-living";
import { qatarCostOfLiving } from "../data/qatar/cost-of-living";
import { saudiCostOfLiving } from "../data/saudi/cost-of-living";
import { originCities, originCostToUSD, type OriginCityData } from "../data/origin-costs";

export type HousingType = "studio" | "1br" | "2br" | "3br" | "villa";
export type TransportMode = "public" | "car" | "mixed";
export type HealthcareTier = "basic" | "premium";
export type Lifestyle = "budget" | "comfort" | "premium";

export interface SimulatorInput {
  citySlug: string;
  housing: HousingType;
  transport: TransportMode;
  healthcare: HealthcareTier;
  children: number;
  lifestyle: Lifestyle;
  originCitySlug?: string;
}

export interface CostBreakdown {
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  education: number;
  utilities: number;
  other: number;
  total: number;
  currency: string;
  cityName: string;
}

export interface ComparisonResult {
  gulf: { total: number; totalUSD: number };
  origin: { total: number; totalUSD: number; cityName: string; currency: string };
  deltaUSD: number;
  deltaPercent: number;
}

interface CityData {
  name: string;
  housing: {
    studioApartment: { min: number; max: number };
    oneBedroom: { min: number; max: number };
    twoBedroom: { min: number; max: number };
    familyVilla: { min: number; max: number };
  };
  food: {
    groceriesMonthly: { min: number; max: number };
    mealBudgetRestaurant: { min: number; max: number };
    mealMidRange: { min: number; max: number };
  };
  transport: {
    metroMonthlyPass: { amount: number };
    taxiPerKm: { amount: number };
    gasolinePerLiter: { amount: number };
    carInsuranceAnnual: { min: number; max: number };
  };
  healthcare: {
    gpVisit: { min: number; max: number };
    annualInsurance: { min: number; max: number };
  };
  education: {
    internationalSchool: { min: number; max: number };
    nursery: { min: number; max: number };
  };
  utilities: {
    monthly: { min: number; max: number };
    internet: { min: number; max: number };
    mobile: { min: number; max: number };
  };
}

const cityDataMap: Record<string, { data: CityData; currency: string; usdRate: number }> = {};

function initCityMap() {
  if (Object.keys(cityDataMap).length > 0) return;
  for (const city of uaeCostOfLiving.cities) {
    cityDataMap[city.name.toLowerCase().replace(/\s+/g, "-")] = {
      data: city as unknown as CityData,
      currency: "AED",
      usdRate: uaeCostOfLiving.usdRate,
    };
  }
  for (const city of qatarCostOfLiving.cities) {
    cityDataMap[city.name.toLowerCase().replace(/\s+/g, "-")] = {
      data: city as unknown as CityData,
      currency: "QAR",
      usdRate: qatarCostOfLiving.usdRate,
    };
  }
  for (const city of saudiCostOfLiving.cities) {
    cityDataMap[city.name.toLowerCase().replace(/\s+/g, "-")] = {
      data: city as unknown as CityData,
      currency: "SAR",
      usdRate: saudiCostOfLiving.usdRate,
    };
  }
}

function lifestyleMultiplier(lifestyle: Lifestyle): number {
  switch (lifestyle) {
    case "budget": return 0;
    case "comfort": return 0.5;
    case "premium": return 1;
  }
}

function lerp(min: number, max: number, t: number): number {
  return Math.round(min + (max - min) * t);
}

export function simulateCost(input: SimulatorInput): CostBreakdown | null {
  initCityMap();
  const entry = cityDataMap[input.citySlug];
  if (!entry) return null;

  const { data, currency } = entry;
  const t = lifestyleMultiplier(input.lifestyle);

  // Housing
  let housing: number;
  switch (input.housing) {
    case "studio":
      housing = lerp(data.housing.studioApartment.min, data.housing.studioApartment.max, t);
      break;
    case "1br":
      housing = lerp(data.housing.oneBedroom.min, data.housing.oneBedroom.max, t);
      break;
    case "2br":
      housing = lerp(data.housing.twoBedroom.min, data.housing.twoBedroom.max, t);
      break;
    case "3br":
      housing = lerp(
        data.housing.twoBedroom.max,
        data.housing.familyVilla.min,
        t
      );
      break;
    case "villa":
      housing = lerp(data.housing.familyVilla.min, data.housing.familyVilla.max, t);
      break;
  }

  // Food
  const groceries = lerp(data.food.groceriesMonthly.min, data.food.groceriesMonthly.max, t);
  const diningOut = lerp(data.food.mealMidRange.min * 4, data.food.mealMidRange.max * 8, t);
  const food = groceries + diningOut;

  // Transport
  let transport: number;
  switch (input.transport) {
    case "public":
      transport = data.transport.metroMonthlyPass.amount || 200;
      break;
    case "car": {
      const fuel = data.transport.gasolinePerLiter.amount * 120; // ~120L/month
      const insurance = lerp(data.transport.carInsuranceAnnual.min, data.transport.carInsuranceAnnual.max, t) / 12;
      const parking = lerp(300, 800, t);
      transport = Math.round(fuel + insurance + parking);
      break;
    }
    case "mixed": {
      const pubPart = (data.transport.metroMonthlyPass.amount || 200) * 0.5;
      const carPart = (data.transport.gasolinePerLiter.amount * 60) + lerp(data.transport.carInsuranceAnnual.min, data.transport.carInsuranceAnnual.max, t) / 24;
      transport = Math.round(pubPart + carPart);
      break;
    }
  }

  // Healthcare (monthly cost beyond employer insurance)
  let healthcare: number;
  if (input.healthcare === "basic") {
    healthcare = lerp(data.healthcare.gpVisit.min, data.healthcare.gpVisit.max, 0) * 1; // 1 visit/month
  } else {
    healthcare = lerp(data.healthcare.gpVisit.min, data.healthcare.gpVisit.max, 1) * 2 +
      lerp(data.healthcare.annualInsurance.min, data.healthcare.annualInsurance.max, 1) / 12;
  }
  healthcare = Math.round(healthcare);

  // Education
  let education = 0;
  if (input.children > 0) {
    const annualPerChild = lerp(data.education.internationalSchool.min, data.education.internationalSchool.max, t);
    education = Math.round((annualPerChild * input.children) / 12);
  }

  // Utilities
  const elecWater = lerp(data.utilities.monthly.min, data.utilities.monthly.max, t);
  const internet = lerp(data.utilities.internet.min, data.utilities.internet.max, t);
  const mobile = lerp(data.utilities.mobile.min, data.utilities.mobile.max, t);
  const utilities = elecWater + internet + mobile;

  // Other (entertainment, clothing, personal)
  const other = lerp(500, 3000, t);

  const total = housing + food + transport + healthcare + education + utilities + other;

  return {
    housing,
    food,
    transport,
    healthcare,
    education,
    utilities,
    other,
    total,
    currency,
    cityName: data.name,
  };
}

export function compareWithOrigin(
  gulfBreakdown: CostBreakdown,
  originCitySlug: string,
  housing: HousingType = "1br",
  children: number = 0
): ComparisonResult | null {
  initCityMap();
  const entry = cityDataMap[gulfBreakdown.cityName.toLowerCase().replace(/\s+/g, "-")];
  if (!entry) return null;

  const originCity = originCities.find((c) => c.slug === originCitySlug);
  if (!originCity) return null;

  const gulfTotalUSD = gulfBreakdown.total / entry.usdRate;
  const originUSD = originCostToUSD(originCity);

  // Match housing type to user's selection
  let originRent: number;
  switch (housing) {
    case "studio":
      originRent = originUSD.studioRent;
      break;
    case "1br":
      originRent = originUSD.oneBedroomRent;
      break;
    default: // 2br, 3br, villa → use 2BR as ceiling
      originRent = originUSD.twoBedroomRent;
      break;
  }

  let originTotalUSD =
    originRent +
    originUSD.groceries +
    originUSD.diningOut +
    originUSD.transport +
    originUSD.utilities +
    originUSD.internet +
    originUSD.mobile +
    originUSD.healthcare +
    originUSD.other;

  // Include education if children selected
  if (children > 0) {
    originTotalUSD += (originUSD.schoolAnnual * children) / 12;
  }

  const deltaUSD = gulfTotalUSD - originTotalUSD;
  const deltaPercent = originTotalUSD > 0 ? (deltaUSD / originTotalUSD) : 0;

  return {
    gulf: { total: gulfBreakdown.total, totalUSD: Math.round(gulfTotalUSD) },
    origin: {
      total: Math.round(originTotalUSD * originCity.usdRate),
      totalUSD: Math.round(originTotalUSD),
      cityName: originCity.name,
      currency: originCity.currency,
    },
    deltaUSD: Math.round(deltaUSD),
    deltaPercent,
  };
}

export function getAvailableCities(): { slug: string; name: string; currency: string }[] {
  initCityMap();
  return Object.entries(cityDataMap).map(([slug, { data, currency }]) => ({
    slug,
    name: data.name,
    currency,
  }));
}

export function getOriginCityOptions(): { slug: string; name: string; country: string }[] {
  return originCities.map((c) => ({ slug: c.slug, name: c.name, country: c.country }));
}
