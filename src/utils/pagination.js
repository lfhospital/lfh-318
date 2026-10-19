// Page numbers to show: first, last, current ±1, with "..." for gaps
export function getPageItems(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("dots-" + p);
    items.push(p);
  });
  return items;
}
