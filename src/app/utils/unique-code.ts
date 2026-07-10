// The fixed prefix shared by every officer/mulk attendance code,
// e.g. MKA-OYO-042. Only the trailing number differs between officers, so
// check-in lets the operator type just the number and we rebuild the rest.
export const OFFICER_CODE_PREFIX = "MKA-OYO-";

// Minimum digits in the numeric part (MKA-OYO-042). Larger numbers are kept
// as-is (MKA-OYO-1234).
const CODE_NUMBER_PAD = 3;

/**
 * Turn whatever the operator typed at check-in into the exact stored code.
 * - Pure digits ("42" / "042")        -> "MKA-OYO-042"  (fast path)
 * - "MKA-OYO-42" / "mka-oyo-42"        -> "MKA-OYO-042"  (re-normalized)
 * - Anything else (legacy OYO-random)  -> uppercased/trimmed as a fallback
 */
export function normalizeOfficerCode(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  // Fast path: operator typed only the number.
  if (/^\d+$/.test(raw)) {
    return `${OFFICER_CODE_PREFIX}${raw.padStart(CODE_NUMBER_PAD, "0")}`;
  }

  const upper = raw.toUpperCase();

  // Operator (or a paste) already included the prefix.
  const withPrefix = upper.match(/^MKA-?OYO-?(\d+)$/);
  if (withPrefix) {
    return `${OFFICER_CODE_PREFIX}${withPrefix[1].padStart(CODE_NUMBER_PAD, "0")}`;
  }

  // Fallback: treat as a full code as-is (e.g. legacy OYO-random codes).
  return upper;
}

/**
 * Legacy client-side code generator, kept only for the officer registration
 * form default. The backend always overrides this with an authoritative
 * sequential MKA-OYO-### code, so the value produced here is never persisted.
 */
export function generateUniqueCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 4;
  let result = "";
  for (let i = 0; i < codeLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return "OYO" + result;
}
