export function formatStars(count: number): string {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  const rounded =
    thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
  return `${rounded}k`;
}

export async function fetchStars(
  ownerRepo: string,
  fetchFn: typeof fetch = fetch,
): Promise<number | null> {
  try {
    const res = await fetchFn(`https://api.github.com/repos/${ownerRepo}`);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const stars = (data as { stargazers_count?: unknown }).stargazers_count;
    return typeof stars === 'number' ? stars : null;
  } catch {
    return null;
  }
}
