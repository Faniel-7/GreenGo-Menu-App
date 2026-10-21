export function formatLocalTime(time) {
  if (!time) return "";

  const match = String(time).match(/^(\d{1,2}):(\d{2})/);

  if (!match) return "";

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return "";
  }

  const date = new Date(2000, 0, 1, hour, minute, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatOfferTime(time) {
  const formatted = formatLocalTime(time);

  if (!formatted) return "";

  return `${formatted} LT (EAT, UTC+3)`;
}