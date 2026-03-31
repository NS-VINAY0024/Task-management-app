/**
 * Formats an ISO date string for display.
 * Returns "N/A" for falsy values.
 */
export const formatDate = (iso?: string | null): string => {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Converts an ISO datetime string → "YYYY-MM-DD" for <input type="date">.
 */
export const toDateInputValue = (iso?: string | null): string => {
  if (!iso) return "";
  return iso.split("T")[0];
};
