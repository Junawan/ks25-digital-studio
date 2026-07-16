export function generateInvoiceNumber() {
  const now = new Date();

  const yy =
    String(
      now.getFullYear()
    ).slice(-2);

  const mm =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      now.getDate()
    ).padStart(2, "0");

  const hh =
    String(
      now.getHours()
    ).padStart(2, "0");

  const mi =
    String(
      now.getMinutes()
    ).padStart(2, "0");

  const ss =
    String(
      now.getSeconds()
    ).padStart(2, "0");

  return `KS25-${yy}${mm}${dd}-${hh}${mi}${ss}`;
}