import { describe, expect, it } from 'vitest';
import { fetchStars, formatStars } from '../src/lib/stars';

describe('formatStars', () => {
  it('returns counts below 1000 verbatim', () => {
    expect(formatStars(0)).toBe('0');
    expect(formatStars(165)).toBe('165');
    expect(formatStars(999)).toBe('999');
  });

  it('formats thousands with one decimal', () => {
    expect(formatStars(1000)).toBe('1k');
    expect(formatStars(2500)).toBe('2.5k');
    expect(formatStars(3530)).toBe('3.5k');
  });

  it('drops the decimal from 10k upwards', () => {
    expect(formatStars(9949)).toBe('9.9k');
    expect(formatStars(12345)).toBe('12k');
  });
});

function fakeFetch(response: Partial<Response> | Error): typeof fetch {
  return async () => {
    if (response instanceof Error) throw response;
    return response as Response;
  };
}

describe('fetchStars', () => {
  it('returns stargazers_count on success', async () => {
    const fetchFn = fakeFetch({
      ok: true,
      json: async () => ({ stargazers_count: 3530 }),
    });
    expect(await fetchStars('fnnx-ai/scikit-llm', fetchFn)).toBe(3530);
  });

  it('returns null on a non-ok response', async () => {
    const fetchFn = fakeFetch({ ok: false, json: async () => ({}) });
    expect(await fetchStars('fnnx-ai/scikit-llm', fetchFn)).toBeNull();
  });

  it('returns null on network errors', async () => {
    const fetchFn = fakeFetch(new Error('offline'));
    expect(await fetchStars('fnnx-ai/scikit-llm', fetchFn)).toBeNull();
  });

  it('returns null on a malformed payload', async () => {
    const fetchFn = fakeFetch({
      ok: true,
      json: async () => ({ stargazers_count: 'many' }),
    });
    expect(await fetchStars('fnnx-ai/scikit-llm', fetchFn)).toBeNull();
  });
});
