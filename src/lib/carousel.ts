/** Dwell time per slide, in milliseconds. FNNX leads and gets the longer read. */
export const SLIDE_DWELL_MS: readonly number[] = [9500, 7000, 7000, 7000];

const DEFAULT_DWELL_MS = 7000;

export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function stepIndex(current: number, delta: number, total: number): number {
  return wrapIndex(current + delta, total);
}

/** Seconds for the `--dwell` custom property that drives a tab's progress bar. */
export function dwellSeconds(index: number): number {
  return (SLIDE_DWELL_MS[index] ?? DEFAULT_DWELL_MS) / 1000;
}

/**
 * Reads a 1-based `slide=N` deep link out of a location hash and/or query
 * string and returns the 0-based slide it selects. Out-of-range values clamp to
 * the nearest slide; anything unparseable falls back to the first.
 */
export function parseSlideOverride(locator: string, total: number): number {
  const match = /slide=(\d+)/.exec(locator);
  if (!match?.[1]) return 0;
  const requested = Number.parseInt(match[1], 10);
  if (Number.isNaN(requested)) return 0;
  return Math.min(total, Math.max(1, requested)) - 1;
}
