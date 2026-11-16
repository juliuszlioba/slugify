/**
 * Letters that don't decompose into "base letter + accent" under Unicode
 * normalization, so they need an explicit transliteration.
 * German umlauts are spelled out (ä → ae) rather than stripped (ä → a).
 */
const SPECIAL_CHARS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  æ: "ae",
  œ: "oe",
  ø: "o",
  å: "a",
  ł: "l",
  đ: "d",
  ð: "d",
  þ: "th",
  ı: "i",
  "&": " and ",
};

const SPECIAL_CHARS_RE = new RegExp(`[${Object.keys(SPECIAL_CHARS).join("")}]`, "g");

/**
 * Converts text into a lowercase, URL-friendly slug.
 *
 * @example slugify("Hällo Wörld & Ąžuolas!") // "haello-woerld-und-azuolas"
 */
export function slugify(input: string): string {
  return (
    input
      // Compose first so "a" + combining diaeresis is treated the same as "ä".
      .normalize("NFC")
      .toLowerCase()
      .replace(SPECIAL_CHARS_RE, (char) => SPECIAL_CHARS[char])
      // Split accented letters into base letter + accent, then drop the accents
      // (covers every Latin diacritic: ą → a, ŷ → y, ő → o, ...).
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      // Drop apostrophes so "don't" becomes "dont", not "don-t".
      .replace(/['’]/g, "")
      // Any run of other characters (spaces, punctuation, symbols) becomes one dash.
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
