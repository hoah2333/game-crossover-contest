const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (locale: string) => {
  const cached = formatters.get(locale);
  if (cached !== undefined) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  formatters.set(locale, formatter);
  return formatter;
};

export const getDate = (time: string | number | Date, locale: string) => {
  const parts = getFormatter(locale).formatToParts(new Date(time));
  return {
    year: parts.find((part) => part.type === "year")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value ?? "",
    day: parts.find((part) => part.type === "day")?.value ?? "",
  };
};
