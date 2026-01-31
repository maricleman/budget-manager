export function currentYearMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function yearMonthFromISO(iso: string): string {
  return iso.slice(0, 7); // "YYYY-MM"
}
