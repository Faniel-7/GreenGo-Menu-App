const TIME_ZONE = "Africa/Addis_Ababa";

function getEthiopiaDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

/**
 * Offer dates are inclusive. If times are provided, they describe the daily
 * time window in Ethiopia time (Africa/Addis_Ababa / EAT). Overnight windows
 * such as 22:00–02:00 are supported.
 */
export function isOfferCurrentlyAvailable(offer, now = new Date()) {
  if (!offer || offer.active !== true) return false;

  const current = getEthiopiaDateTime(now);
  const startDate = offer.start_date ? String(offer.start_date).slice(0, 10) : "";
  const endDate = offer.end_date ? String(offer.end_date).slice(0, 10) : "";

  if (startDate && current.date < startDate) return false;
  if (endDate && current.date > endDate) return false;

  const startTime = offer.start_time ? String(offer.start_time).slice(0, 5) : "";
  const endTime = offer.end_time ? String(offer.end_time).slice(0, 5) : "";

  const validTime = (value) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  if (startTime && !validTime(startTime)) return false;
  if (endTime && !validTime(endTime)) return false;

  // Respect the exact start/end time on the first/last scheduled date.
  if (startDate && current.date === startDate && startTime && current.time < startTime) return false;
  if (endDate && current.date === endDate && endTime && current.time > endTime) return false;

  if (startTime && endTime) {
    if (startTime <= endTime) {
      return current.time >= startTime && current.time <= endTime;
    }
    // Overnight window, e.g. 22:00 to 02:00.
    return current.time >= startTime || current.time <= endTime;
  }

  if (startTime && current.time < startTime) return false;
  if (endTime && current.time > endTime) return false;

  return true;
}
