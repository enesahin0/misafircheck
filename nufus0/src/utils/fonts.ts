// Yerel (public/fonts) yazı tipleri — çevrimdışı çalışır. Türkçe karakterler için latin + latin-ext.
import { continueRender, delayRender, staticFile } from "remotion";
import { useEffect, useState } from "react";

const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const FACES: { family: string; weight: number; file: string; range: string }[] = [];
for (const w of [500, 700]) {
  FACES.push({ family: "IBM Plex Mono", weight: w, file: `ibm-plex-mono-latin-${w}-normal.woff2`, range: LATIN });
  FACES.push({ family: "IBM Plex Mono", weight: w, file: `ibm-plex-mono-latin-ext-${w}-normal.woff2`, range: LATIN_EXT });
}
for (const w of [600, 700]) {
  FACES.push({ family: "Barlow Condensed", weight: w, file: `barlow-condensed-latin-${w}-normal.woff2`, range: LATIN });
  FACES.push({ family: "Barlow Condensed", weight: w, file: `barlow-condensed-latin-ext-${w}-normal.woff2`, range: LATIN_EXT });
}

let loading: Promise<void> | null = null;
const loadAll = (): Promise<void> => {
  if (!loading) {
    loading = Promise.all(
      FACES.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
          weight: String(f.weight),
          unicodeRange: f.range,
        });
        await face.load();
        document.fonts.add(face);
      }),
    ).then(async () => {
      // Canvas dokularında kullanılacak ağırlıkları önceden ısıt
      await Promise.all([
        document.fonts.load('700 40px "Barlow Condensed"', "ŞİĞ"),
        document.fonts.load('700 40px "IBM Plex Mono"', "ŞİĞ"),
        document.fonts.load('500 40px "IBM Plex Mono"', "ŞİĞ"),
      ]);
    });
  }
  return loading;
};

export const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Yazı tipleri yükleniyor"));
  useEffect(() => {
    loadAll()
      .catch((e) => console.warn("Font yüklenemedi, yedek font kullanılacak:", e))
      .finally(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};

export const FONT_MONO = '"IBM Plex Mono", ui-monospace, monospace';
export const FONT_HEAD = '"Barlow Condensed", "Arial Narrow", sans-serif';
