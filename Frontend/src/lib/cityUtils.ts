export function formatCityName(city?: string | null): string {
  if (!city) return "";
  const trimmed = city.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "bengaluru") return "Bangalore";
  if (lower === "gurgaon") return "Gurugram";
  if (lower === "bombay") return "Mumbai";
  if (lower === "madras") return "Chennai";
  if (lower === "calcutta") return "Kolkata";
  return trimmed;
}
