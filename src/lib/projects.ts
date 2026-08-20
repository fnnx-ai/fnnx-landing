/**
 * The fnnx.ai catalogue. fnnx.ai is the ecosystem; FNNX is its centrepiece.
 * Every project stands alone. What each one records is where it meets the
 * artifact: the others write it, FNNX runs it.
 */

export type RelationId = 'exports-fnnx' | 'runs-fnnx';

export const RELATIONS: Record<RelationId, { glyph: string; label: string }> = {
  'exports-fnnx': { glyph: '↗', label: 'Exports .fnnx' },
  'runs-fnnx': { glyph: '◆', label: 'Runs .fnnx' },
};

export interface Project {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  relations: readonly RelationId[];
  repo: string;
  fallbackStars: number;
  /** Opens the carousel and carries a section of its own further down the page. */
  flagship: boolean;
}

/** Catalogue order is also carousel order: the centrepiece opens, the rest follow. */
export const PROJECTS: readonly Project[] = [
  {
    id: 'fnnx',
    name: 'FNNX',
    logo: '/logos/fnnx.svg',
    tagline: 'Package and run machine learning models anywhere.',
    relations: ['runs-fnnx'],
    repo: 'fnnx-ai/FNNX',
    fallbackStars: 50,
    flagship: true,
  },
  {
    id: 'scikit-llm',
    name: 'Scikit-LLM',
    logo: '/logos/scikit-llm.svg',
    tagline: 'Large language models in the familiar scikit-learn API.',
    relations: ['exports-fnnx'],
    repo: 'fnnx-ai/scikit-llm',
    fallbackStars: 3530,
    flagship: false,
  },
  {
    id: 'falcon',
    name: 'Falcon',
    logo: '/logos/falcon.svg',
    tagline: 'Production-ready ML training in a single line of code.',
    relations: ['exports-fnnx'],
    repo: 'fnnx-ai/falcon',
    fallbackStars: 165,
    flagship: false,
  },
  {
    id: 'firefly',
    name: 'Firefly',
    logo: '/logos/firefly.svg',
    tagline: 'A minimal, torch-like deep learning framework.',
    relations: ['exports-fnnx'],
    repo: 'fnnx-ai/firefly',
    fallbackStars: 34,
    flagship: false,
  },
];

export const GITHUB_ORG = 'https://github.com/fnnx-ai';

export function repoUrl(project: Project): string {
  return `https://github.com/${project.repo}`;
}

/** Two-digit slide labels, so `01 / 04` reads the same on every caption. */
export function slideLabel(index: number): string {
  return String(index + 1).padStart(2, '0');
}

