export function formatOfferDate(date) {

  if (!date) return "";

  const formatted = new Date(date);

  return formatted.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

}