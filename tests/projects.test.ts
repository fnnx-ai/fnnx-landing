import { describe, expect, it } from 'vitest';
import { PROJECTS, RELATIONS, repoUrl, slideLabel } from '../src/lib/projects';

describe('project catalogue', () => {
  it('keeps ids unique', () => {
    expect(new Set(PROJECTS.map((project) => project.id)).size).toBe(PROJECTS.length);
  });

  it('points every repo at the fnnx-ai organisation', () => {
    for (const project of PROJECTS) expect(project.repo).toMatch(/^fnnx-ai\//);
  });

  it('names only relationships the catalogue defines', () => {
    for (const project of PROJECTS) {
      for (const id of project.relations) expect(RELATIONS[id]).toBeDefined();
    }
  });

  it('leads with a single centrepiece', () => {
    const lead = PROJECTS.filter((project) => project.flagship);
    expect(lead).toHaveLength(1);
    expect(PROJECTS[0]).toBe(lead[0]);
  });
});

describe('repoUrl', () => {
  it('builds a GitHub url from the repo slug', () => {
    expect(repoUrl(PROJECTS[0]!)).toBe(`https://github.com/${PROJECTS[0]!.repo}`);
  });
});

describe('slideLabel', () => {
  it('numbers from one, zero-padded to two digits', () => {
    expect(slideLabel(0)).toBe('01');
    expect(slideLabel(3)).toBe('04');
  });

  it('widens past nine', () => {
    expect(slideLabel(11)).toBe('12');
  });
});

describe('relationships', () => {
  it('puts every project on one side of the artifact', () => {
    for (const project of PROJECTS) {
      expect(project.relations).toContain(project.flagship ? 'runs-fnnx' : 'exports-fnnx');
    }
  });
});
