function parseLocalDate(date) {
  if (!date) return null;

  const parts = String(date).split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }

  const [year, month, day] = parts;
  const parsed = new Date(year, month - 1, day, 12, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function formatOfferDate(date) {
  const parsed = parseLocalDate(date);

  if (!parsed) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatGregorianDate(date) {
  return formatOfferDate(date);
}

export function formatEthiopianDate(date) {
  const parsed = parseLocalDate(date);

  if (!parsed) return "";

  try {
    return new Intl.DateTimeFormat("en-ET-u-ca-ethiopic", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Addis_Ababa",
    }).format(parsed);
  } catch (error) {
  
    return "";
  }
}

export function formatOfferDateBoth(date) {
  if (!date) return "";

  const gregorian = formatGregorianDate(date);
  const ethiopian = formatEthiopianDate(date);

  if (!gregorian) return "";

  if (!ethiopian) {
    return `${gregorian} (G.C.)`;
  }

  return `${gregorian} (G.C.) · ${ethiopian} (E.C.)`;
}