const pad2 = (value) => String(value).padStart(2, "0");

export function parseGregorianDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function gregorianToJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

function ethiopianToJdn(year, month, day) {
  return (
    1724221 +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day -
    1
  );
}

export function ethiopianDateToGregorian(value) {
  if (!value || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (
    year < 1 ||
    month < 1 ||
    month > 13 ||
    day < 1 ||
    day > 30
  ) {
    return null;
  }

  if (month === 13 && day > (year % 4 === 3 ? 6 : 5)) {
    return null;
  }

  const converted = jdnToGregorian(
    ethiopianToJdn(year, month, day)
  );

  const result =
    `${converted.year}-${pad2(converted.month)}-${pad2(converted.day)}`;

  return parseGregorianDate(result) ? result : null;
}

export function gregorianDateToEthiopian(value) {
  const date = parseGregorianDate(value);

  if (!date) {
    return "";
  }

  const jdn = gregorianToJdn(
    date.year,
    date.month,
    date.day
  );

  let year = date.year - 7;

  if (jdn < ethiopianToJdn(year, 1, 1)) {
    year -= 1;
  }

  const dayOfYear = jdn - ethiopianToJdn(year, 1, 1);
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function convertDateForCalendar(
  gregorianDate,
  calendar = "GC"
) {
  if (!gregorianDate) {
    return "";
  }

  return calendar === "EC"
    ? gregorianDateToEthiopian(gregorianDate)
    : gregorianDate;
}

export function convertInputDateToGregorian(
  value,
  calendar = "GC"
) {
  if (!value) {
    return "";
  }

  if (calendar === "EC") {
    return ethiopianDateToGregorian(value) || "";
  }

  return parseGregorianDate(value) ? value : "";
}

export function formatOfferDate(date) {
  const parsed = parseGregorianDate(date);

  if (!parsed) {
    return "";
  }

  const gregorian = new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day)
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const ethiopian = gregorianDateToEthiopian(date);

  return `${gregorian} (E.C. ${ethiopian})`;
}

export function formatOfferDateBoth(date) {
  const parsed = parseGregorianDate(date);

  if (!parsed) {
    return "";
  }

  const gregorian = new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day)
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const ec = gregorianDateToEthiopian(date);

  if (!ec) {
    return gregorian;
  }

  const [ecYear, ecMonth, ecDay] = ec.split("-").map(Number);

  const ethiopianMonths = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miazia",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
  ];

  return (
    `${gregorian} · E.C. ${ecYear}, ` +
    `${ethiopianMonths[ecMonth - 1]} ${ecDay}`
  );
}