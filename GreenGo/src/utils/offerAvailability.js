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

  const overnight = Boolean(startTime && endTime && startTime > endTime);

  // Respect the start boundary on the first scheduled date.
  if (startDate && current.date === startDate && startTime && current.time < startTime) return false;

  // A same-day overnight schedule means the late-night portion of that date.
  // Do not let the end-time boundary incorrectly hide its 22:00–23:59 portion.
  if (overnight && startDate && endDate && startDate === endDate) {
    return current.time >= startTime;
  }

  // For overnight ranges spanning multiple dates, the end date allows the
  // after-midnight portion but not a new late-night window after the end date.
  if (endDate && current.date === endDate && endTime && !overnight && current.time > endTime) return false;
  if (overnight && endDate && current.date === endDate && current.time >= startTime) return false;

  if (startTime && endTime) {
    if (!overnight) {
      return current.time >= startTime && current.time <= endTime;
    }
    // Overnight window, e.g. 22:00 to 02:00.
    return current.time >= startTime || current.time <= endTime;
  }

  if (endDate && current.date === endDate && endTime && current.time > endTime) return false;

  if (startTime && current.time < startTime) return false;
  if (endTime && current.time > endTime) return false;

  return true;
}
