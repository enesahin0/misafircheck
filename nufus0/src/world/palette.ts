// CLAUDE.md §3 paleti — sabit. Türev tonlar yalnızca aynı ailenin açık/koyu hâlidir.
export const C = {
  deepNight: "#0B0E12", // arka plan / sis
  slate: "#1E252D", // binalar / paneller
  concrete: "#39444B", // yol, duvar, kaldırım
  red: "#BD373F", // 03.17 anonsu, karar, anormallik
  bone: "#E0DDD4", // ana tipografi
  amber: "#967753", // yanan pencere / lamba

  // türevler
  slateLight: "#27303A",
  slateDark: "#161C22",
  concreteLight: "#46535B",
  concreteDark: "#2A3338",
  lot: "#1B2228",
  asphalt: "#252E34",
  amberGlow: "#C49A5E",
  redDark: "#6E2227",
  windowDark: "#0E1318",
  skin: "#8B7566",
  paper: "#B9B3A3",
} as const;

export const FOG = C.deepNight;

export const T = {
  tree: "#1F2B29",
  treeDark: "#18221F",
  carGrey: "#2F3A41",
  carDark: "#222B31",
} as const;
