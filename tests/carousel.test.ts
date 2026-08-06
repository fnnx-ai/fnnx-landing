import { describe, expect, it } from 'vitest';
import {
  SLIDE_DWELL_MS,
  dwellSeconds,
  parseSlideOverride,
  stepIndex,
  wrapIndex,
} from '../src/lib/carousel';

describe('wrapIndex', () => {
  it('passes through in-range indices', () => {
    expect(wrapIndex(0, 4)).toBe(0);
    expect(wrapIndex(3, 4)).toBe(3);
  });

  it('wraps past both ends', () => {
    expect(wrapIndex(4, 4)).toBe(0);
    expect(wrapIndex(9, 4)).toBe(1);
    expect(wrapIndex(-1, 4)).toBe(3);
    expect(wrapIndex(-6, 4)).toBe(2);
  });

  it('collapses to zero without slides', () => {
    expect(wrapIndex(2, 0)).toBe(0);
  });
});

describe('stepIndex', () => {
  it('advances and wraps forward', () => {
    expect(stepIndex(0, 1, 4)).toBe(1);
    expect(stepIndex(3, 1, 4)).toBe(0);
  });

  it('retreats and wraps backward', () => {
    expect(stepIndex(1, -1, 4)).toBe(0);
    expect(stepIndex(0, -1, 4)).toBe(3);
  });
});

describe('dwellSeconds', () => {
  it('gives the lead slide the longer dwell', () => {
    expect(dwellSeconds(0)).toBe(9.5);
    expect(dwellSeconds(1)).toBe(7);
    expect(dwellSeconds(SLIDE_DWELL_MS.length - 1)).toBe(7);
  });

  it('falls back for indices outside the schedule', () => {
    expect(dwellSeconds(99)).toBe(7);
  });
});

describe('parseSlideOverride', () => {
  it('reads a slide from the hash', () => {
    expect(parseSlideOverride('#slide=1', 4)).toBe(0);
    expect(parseSlideOverride('#slide=3', 4)).toBe(2);
  });

  it('reads a slide from the query string', () => {
    expect(parseSlideOverride('#&?slide=4', 4)).toBe(3);
  });

  it('clamps values outside the deck', () => {
    expect(parseSlideOverride('#slide=0', 4)).toBe(0);
    expect(parseSlideOverride('#slide=99', 4)).toBe(3);
  });

  it('falls back to the first slide', () => {
    expect(parseSlideOverride('', 4)).toBe(0);
    expect(parseSlideOverride('#slide=abc', 4)).toBe(0);
    expect(parseSlideOverride('#about', 4)).toBe(0);
  });
});
