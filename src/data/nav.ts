export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "UAE",
    href: "/uae/guide/",
    children: [
      { label: "Expat Guide", href: "/uae/guide/" },
      { label: "Salaries", href: "/uae/salaries/" },
      { label: "Gratuity Calculator", href: "/uae/gratuity-calculator/" },
      { label: "Salary Calculator", href: "/uae/salary-calculator/" },
      { label: "Visa Guide", href: "/uae/visa-guide/" },
      { label: "Labor Law", href: "/uae/labor-law/" },
      { label: "Cost of Living", href: "/uae/cost-of-living/" },
    ],
  },
  {
    label: "Qatar",
    href: "/qatar/guide/",
    children: [
      { label: "Expat Guide", href: "/qatar/guide/" },
      { label: "Salaries", href: "/qatar/salaries/" },
      { label: "Gratuity Calculator", href: "/qatar/gratuity-calculator/" },
      { label: "Salary Calculator", href: "/qatar/salary-calculator/" },
      { label: "Visa Guide", href: "/qatar/visa-guide/" },
      { label: "Labor Law", href: "/qatar/labor-law/" },
      { label: "Cost of Living", href: "/qatar/cost-of-living/" },
    ],
  },
  {
    label: "Saudi Arabia",
    href: "/saudi-arabia/guide/",
    children: [
      { label: "Expat Guide", href: "/saudi-arabia/guide/" },
      { label: "Salaries", href: "/saudi-arabia/salaries/" },
      { label: "Gratuity Calculator", href: "/saudi-arabia/gratuity-calculator/" },
      { label: "Salary Calculator", href: "/saudi-arabia/salary-calculator/" },
      { label: "Visa Guide", href: "/saudi-arabia/visa-guide/" },
      { label: "Labor Law", href: "/saudi-arabia/labor-law/" },
      { label: "Cost of Living", href: "/saudi-arabia/cost-of-living/" },
    ],
  },
  {
    label: "Relocating From",
    href: "/relocating-from/india/",
    children: [
      { label: "India", href: "/relocating-from/india/" },
      { label: "Pakistan", href: "/relocating-from/pakistan/" },
      { label: "Philippines", href: "/relocating-from/philippines/" },
      { label: "Egypt", href: "/relocating-from/egypt/" },
      { label: "Bangladesh", href: "/relocating-from/bangladesh/" },
      { label: "United Kingdom", href: "/relocating-from/uk/" },
      { label: "United States", href: "/relocating-from/usa/" },
      { label: "France", href: "/relocating-from/france/" },
    ],
  },
];

export const footerNav = {
  countries: [
    { label: "UAE Guide", href: "/uae/guide/" },
    { label: "Qatar Guide", href: "/qatar/guide/" },
    { label: "Saudi Arabia Guide", href: "/saudi-arabia/guide/" },
  ],
  calculators: [
    { label: "UAE Gratuity Calculator", href: "/uae/gratuity-calculator/" },
    { label: "Qatar Gratuity Calculator", href: "/qatar/gratuity-calculator/" },
    { label: "Saudi Gratuity Calculator", href: "/saudi-arabia/gratuity-calculator/" },
    { label: "UAE Salary Calculator", href: "/uae/salary-calculator/" },
    { label: "Qatar Salary Calculator", href: "/qatar/salary-calculator/" },
    { label: "Saudi Salary Calculator", href: "/saudi-arabia/salary-calculator/" },
  ],
  resources: [
    { label: "UAE Salaries", href: "/uae/salaries/" },
    { label: "Qatar Salaries", href: "/qatar/salaries/" },
    { label: "Saudi Salaries", href: "/saudi-arabia/salaries/" },
    { label: "UAE Visa Guide", href: "/uae/visa-guide/" },
    { label: "Qatar Visa Guide", href: "/qatar/visa-guide/" },
    { label: "Saudi Visa Guide", href: "/saudi-arabia/visa-guide/" },
  ],
  legal: [
    { label: "About", href: "/about/" },
    { label: "Methodology", href: "/methodology/" },
    { label: "News", href: "/news/" },
    { label: "Contact", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy-policy/" },
    { label: "Terms of Use", href: "/terms/" },
  ],
};
