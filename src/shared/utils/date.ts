export function formatDate(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatDateTime(
  value: Date | string | number
): string {
  return formatDate(value, {
    hour: "2-digit",
    minute: "2-digit",
  });
}