import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    rules: {
      "@next/next/no-img-element": "off",
      // New in the React hooks plugin that ships with Next 16. It flags the
      // close-menu-on-navigation effect in components/SiteHeader.tsx, which
      // predates the rule; kept as a warning so the upgrade changes no component.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  { ignores: [".next/**", "out/**", "next-env.d.ts"] },
];

export default config;
