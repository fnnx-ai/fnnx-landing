import { describe, expect, it } from 'vitest';
import {
  CODE_SLOTS,
  MEMBERS,
  MEMBER_IDS,
  ROOT,
  TREE,
  codeHtml,
  countLines,
  crumbFor,
  gutterFor,
  highlightCode,
  highlightJson,
  highlightPython,
  stepMember,
} from '../src/lib/artifact';

describe('artifact data', () => {
  it('gives every inspectable tree row a member', () => {
    for (const id of MEMBER_IDS) expect(MEMBERS[id]).toBeDefined();
  });

  it('has no member without a tree row', () => {
    expect(Object.keys(MEMBERS).sort()).toEqual([...MEMBER_IDS].sort());
  });

  it('keeps member ids in tree order', () => {
    expect(MEMBER_IDS).toEqual(TREE.filter((row) => row.id).map((row) => row.id));
  });

  it('stores paths without a trailing slash', () => {
    for (const member of Object.values(MEMBERS)) expect(member.path).not.toMatch(/\/$/);
  });
});

describe('highlightJson', () => {
  it('marks keys, strings, numbers and literals apart', () => {
    expect(highlightJson('{"a": "b"}')).toBe(
      '<span class="t-punct">{</span><span class="t-key">"a"</span>' +
        '<span class="t-punct">:</span> <span class="t-str">"b"</span>' +
        '<span class="t-punct">}</span>',
    );
    expect(highlightJson('-1')).toBe('<span class="t-num">-1</span>');
    expect(highlightJson('false')).toBe('<span class="t-lit">false</span>');
  });

  it('escapes html before wrapping tokens', () => {
    expect(highlightJson('"<&>"')).toBe('<span class="t-str">"&lt;&amp;&gt;"</span>');
  });
});

describe('highlightPython', () => {
  it('marks comments, strings and keywords', () => {
    expect(highlightPython('# hi')).toBe('<span class="t-com"># hi</span>');
    expect(highlightPython('"x"')).toBe('<span class="t-str">"x"</span>');
    expect(highlightPython('return')).toBe('<span class="t-kw">return</span>');
  });

  it('leaves identifiers alone', () => {
    expect(highlightPython('classifier')).toBe('classifier');
  });
});

describe('highlightCode', () => {
  it('dispatches on the member language', () => {
    expect(highlightCode('# hi', 'py')).toContain('t-com');
    expect(highlightCode('1', 'json')).toContain('t-num');
  });
});

describe('gutterFor', () => {
  it('numbers every line, zero-padded to two digits', () => {
    expect(gutterFor('a\nb\nc')).toBe('01\n02\n03');
  });

  it('widens past nine lines', () => {
    expect(gutterFor(Array(11).fill('x').join('\n')).split('\n').at(-1)).toBe('11');
  });
});

describe('codeHtml', () => {
  it('pads short members out to the viewport height', () => {
    const html = codeHtml({ ...MEMBERS.variant!, code: 'a\nb' }, 5);
    expect(html.endsWith('<span class="t-tilde">\n~\n~\n~</span>')).toBe(true);
  });

  it('pads nothing when the member fills the viewport', () => {
    expect(codeHtml({ ...MEMBERS.variant!, code: 'a\nb' }, 2)).not.toContain('t-tilde');
  });

  it('never overflows the viewport it pads to', () => {
    for (const member of Object.values(MEMBERS)) {
      expect(countLines(member.code)).toBeLessThanOrEqual(CODE_SLOTS);
    }
  });
});

describe('crumbFor', () => {
  it('roots the trail at the archive', () => {
    expect(crumbFor(MEMBERS.manifest!)).toEqual({ trail: [ROOT], leaf: 'manifest.json' });
  });

  it('splits nested paths', () => {
    expect(crumbFor(MEMBERS.onnx!)).toEqual({
      trail: [ROOT, 'ops_artifacts', 'classifier'],
      leaf: 'model.onnx',
    });
  });

  it('marks directory leaves with a slash', () => {
    expect(crumbFor(MEMBERS.metaart!)).toEqual({ trail: [ROOT], leaf: 'meta_artifacts/' });
  });
});

describe('stepMember', () => {
  const ids = ['a', 'b', 'c'];

  it('steps forward and back', () => {
    expect(stepMember('a', 1, ids)).toBe('b');
    expect(stepMember('b', -1, ids)).toBe('a');
  });

  it('wraps at both ends', () => {
    expect(stepMember('c', 1, ids)).toBe('a');
    expect(stepMember('a', -1, ids)).toBe('c');
  });

  it('falls back to the first member for an unknown id', () => {
    expect(stepMember('zzz', 1, ids)).toBe('a');
  });
});
