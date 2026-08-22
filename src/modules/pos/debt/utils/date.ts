export function formatDate(
  value: unknown
): string {
  if (!value) {
    return "-";
  }

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
  } else if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    date = new Date(value);
  } else {
    return "-";
  }

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}