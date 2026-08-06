export type MemberKind = 'json' | 'python' | 'binary' | 'dir';
export type Lang = 'json' | 'py';

export interface TreeRow {
  /** Box-drawing prefix, rendered verbatim like `tar -tf` output. */
  readonly glyph: string;
  readonly name: string;
  /** Inspectable members carry an id; pure directory rows do not. */
  readonly id: string | null;
}

export interface Member {
  /** Archive-relative path, never with a trailing slash. */
  readonly path: string;
  readonly kind: MemberKind;
  readonly role: string;
  readonly refLabel: string;
  readonly refValue: string;
  readonly status: string;
  readonly valid: boolean;
  readonly lang: Lang;
  readonly code: string;
}

export const ROOT = 'model.fnnx';
export const SPEC_VERSION = '0.0.4';

/** Rows a builder actually writes, in the order `tar -tf` lists them. */
export const TREE: readonly TreeRow[] = [
  { glyph: '├── ', name: 'manifest.json', id: 'manifest' },
  { glyph: '├── ', name: 'ops.json', id: 'ops' },
  { glyph: '├── ', name: 'variant_config.json', id: 'variant' },
  { glyph: '├── ', name: 'dtypes.json', id: 'dtypes' },
  { glyph: '├── ', name: 'env.json', id: 'env' },
  { glyph: '├── ', name: 'meta.json', id: 'meta' },
  { glyph: '├── ', name: 'ops_artifacts/', id: null },
  { glyph: '│   └── ', name: 'classifier/', id: null },
  { glyph: '│       └── ', name: 'model.onnx', id: 'onnx' },
  { glyph: '├── ', name: 'variant_artifacts/', id: null },
  { glyph: '│   ├── ', name: '__pyfunc__.py', id: 'pyfunc' },
  { glyph: '│   ├── ', name: 'extra_modules/', id: 'modules' },
  { glyph: '│   └── ', name: 'extra_files/', id: 'files' },
  { glyph: '└── ', name: 'meta_artifacts/', id: 'metaart' },
];

export const MEMBERS: Readonly<Record<string, Member>> = {
  manifest: {
    path: 'manifest.json',
    kind: 'json',
    role: 'The contract — the variant and I/O every runtime honors.',
    refLabel: 'validated against',
    refValue: 'spec/schemas/manifest.json',
    status: 'schema valid',
    valid: true,
    lang: 'json',
    code: `{
    "variant": "pyfunc",
    "name": "sentiment-classifier",
    "version": "1.4.0",
    "inputs": [
        { "name": "text", "content_type": "NDJSON",
          "dtype": "Array[string]", "shape": [-1] }
    ],
    "outputs": [
        { "name": "label", "content_type": "NDJSON",
          "dtype": "Array[int64]", "shape": [-1] }
    ]
}`,
  },
  ops: {
    path: 'ops.json',
    kind: 'json',
    role: 'Op instances the runtime constructs — one artifact directory each.',
    refLabel: 'validated against',
    refValue: 'spec/schemas/ops.json',
    status: 'schema valid',
    valid: true,
    lang: 'json',
    code: `[
    {
        "id": "classifier",
        "op": "ONNX_v1",
        "inputs":  [ { "dtype": "float32", "shape": [-1, 768] } ],
        "outputs": [ { "dtype": "int64",   "shape": [-1] } ],
        "attributes": {
            "opsets": [ { "domain": "", "version": 17 } ],
            "requires_ort_extensions": false,
            "has_external_data": false,
            "onnx_ir_version": 9
        },
        "dynamic_attributes": {}
    }
]`,
  },
  variant: {
    path: 'variant_config.json',
    kind: 'json',
    role: 'Variant wiring — pyfunc names a class, pipeline wires a DAG.',
    refLabel: 'validated against',
    refValue: 'spec/schemas/variant_pyfunc.json',
    status: 'schema valid',
    valid: true,
    lang: 'json',
    code: `{
    "pyfunc_classname": "SentimentClassifier",
    "extra_values": {
        "labels": ["negative", "neutral", "positive"]
    }
}`,
  },
  dtypes: {
    path: 'dtypes.json',
    kind: 'json',
    role: 'Extra dtypes, declared as JSON Schema and namespaced ext::.',
    refLabel: 'loaded into',
    refValue: 'DtypesManager(external_dtypes, BUILTINS)',
    status: 'json schema',
    valid: false,
    lang: 'json',
    code: `{
    "ext::chat_message": {
        "type": "object",
        "properties": {
            "role":    { "type": "string" },
            "content": { "type": "string" }
        },
        "required": ["role", "content"]
    }
}`,
  },
  env: {
    path: 'env.json',
    kind: 'json',
    role: 'How to rebuild the interpreter this model was frozen against.',
    refLabel: 'validated against',
    refValue: 'spec/schemas/env.json',
    status: 'schema valid',
    valid: true,
    lang: 'json',
    code: `{
    "python3::conda_pip": {
        "python_version": "3.11.9",
        "build_dependencies": ["pip==24.0", "setuptools==69.5.1"],
        "dependencies": [
            { "package": "fnnx[core]==0.0.12" },
            { "package": "onnxruntime-gpu==1.18.0",
              "condition": { "accelerator": ["cuda"] } }
        ],
        "conda_channels": null
    }
}`,
  },
  meta: {
    path: 'meta.json',
    kind: 'json',
    role: 'Provenance. Additive, namespaced, never read by the runtime.',
    refLabel: 'validated against',
    refValue: 'spec/schemas/meta_entry.json',
    status: 'schema valid',
    valid: true,
    lang: 'json',
    code: `[
    {
        "id": "mlflow-source",
        "producer": "fnnx.ai",
        "producer_version": "0.0.12",
        "payload": {
            "flavors": ["python_function", "sklearn"],
            "loader_module": "mlflow.sklearn",
            "mlflow_version": "3.4.0"
        }
    }
]`,
  },
  onnx: {
    path: 'ops_artifacts/classifier/model.onnx',
    kind: 'binary',
    role: 'The op payload. Its directory name is the op instance id.',
    refLabel: 'read by',
    refValue: 'fnnx/ops/onnx.py — OnnxOp_V1.warmup',
    status: 'no schema · opaque blob',
    valid: false,
    lang: 'py',
    code: `self.model_path = pjoin(self.artifact_path, "model.onnx")

self._sess = ort.InferenceSession(
    self.model_path,
    providers=execution_providers,
    sess_options=session_options,
)

self._ort_inputs  = [i.name for i in self._sess.get_inputs()]
self._ort_outputs = [o.name for o in self._sess.get_outputs()]`,
  },
  pyfunc: {
    path: 'variant_artifacts/__pyfunc__.py',
    kind: 'python',
    role: 'The class named in variant_config.json, frozen as source.',
    refLabel: 'imported by',
    refValue: 'PyFuncVariant.get_pyfunc()',
    status: 'must subclass PyFunc',
    valid: false,
    lang: 'py',
    code: `class SentimentClassifier(PyFunc):
    def warmup(self):
        self.clf = self.fnnx_context.get_op_instance("classifier")
        self.labels = self.fnnx_context.get_value("labels")

    def compute(self, inputs: dict, dynamic_attributes: dict) -> dict:
        ...

    async def compute_async(self, inputs, dynamic_attributes) -> dict:
        ...`,
  },
  modules: {
    path: 'variant_artifacts/extra_modules',
    kind: 'dir',
    role: 'Vendored packages, on sys.path only while the pyfunc loads.',
    refLabel: 'scoped by',
    refValue: 'temp_sys_path() in fnnx/variants/pyfunc.py',
    status: 'import isolation',
    valid: false,
    lang: 'py',
    code: `# nothing leaks into the host interpreter
with temp_sys_path(extra_modules_path, _pyfunc_lock):
    spec = importlib.util.spec_from_file_location(
        unique_module_name, self.pyfunc_file_path
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    cls = getattr(module, self.pyfunc_classname)`,
  },
  files: {
    path: 'variant_artifacts/extra_files',
    kind: 'dir',
    role: 'Everything else the pyfunc needs. Reached by name, never by path.',
    refLabel: 'indexed at load into',
    refValue: 'Context.files / Context.dir',
    status: 'relocatable',
    valid: false,
    lang: 'py',
    code: `# the artifact is unpacked to a temp dir — absolute paths
# are resolved for you, so nothing inside is hard-coded
vocab     = self.fnnx_context.get_filepath("vocab.txt")
model_dir = self.fnnx_context.get_dirpath("hf_model")`,
  },
  metaart: {
    path: 'meta_artifacts',
    kind: 'dir',
    role: 'Blobs a meta entry points at. Provenance, never inference.',
    refLabel: 'created by',
    refValue: 'File.make_artifacts_folders',
    status: 'empty by default',
    valid: false,
    lang: 'py',
    code: `def make_artifacts_folders(self):
    self.create_file("meta_artifacts/.keep", ".keep")
    self.create_file("ops_artifacts/.keep", ".keep")
    self.create_file("variant_artifacts/extra_modules/.keep", ".keep")
    self.create_file("variant_artifacts/extra_files/.keep", ".keep")`,
  },
};

export const MEMBER_IDS: readonly string[] = TREE.flatMap((row) => (row.id ? [row.id] : []));

/** Rows the viewport holds; shorter members are padded out to this height. */
export const CODE_SLOTS = 19;

function escapeHtml(source: string): string {
  return source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const JSON_TOKEN =
  /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;

export function highlightJson(source: string): string {
  return escapeHtml(source).replace(
    JSON_TOKEN,
    (_m, key: string, colon: string, str: string, num: string, lit: string, punct: string) => {
      if (key) return `<span class="t-key">${key}</span><span class="t-punct">${colon}</span>`;
      if (str) return `<span class="t-str">${str}</span>`;
      if (num) return `<span class="t-num">${num}</span>`;
      if (lit) return `<span class="t-lit">${lit}</span>`;
      return `<span class="t-punct">${punct}</span>`;
    },
  );
}

const PY_TOKEN =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(class|def|async|await|with|for|in|import|from|as|return|None|True|False|self)\b|\b(\d+)\b/g;

export function highlightPython(source: string): string {
  return escapeHtml(source).replace(
    PY_TOKEN,
    (_m, comment: string, str: string, keyword: string, num: string) => {
      if (comment) return `<span class="t-com">${comment}</span>`;
      if (str) return `<span class="t-str">${str}</span>`;
      if (keyword) return `<span class="t-kw">${keyword}</span>`;
      return `<span class="t-num">${num}</span>`;
    },
  );
}

export function highlightCode(source: string, lang: Lang): string {
  return lang === 'py' ? highlightPython(source) : highlightJson(source);
}

export function countLines(code: string): number {
  return code.split('\n').length;
}

/** Line numbers for the code gutter, zero-padded to two digits. */
export function gutterFor(code: string): string {
  return Array.from({ length: countLines(code) }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  ).join('\n');
}

/** Highlighted source, padded past the buffer with vim's tildes. */
export function codeHtml(member: Member, slots: number = CODE_SLOTS): string {
  const body = highlightCode(member.code, member.lang);
  const fill = Math.max(0, slots - countLines(member.code));
  if (fill === 0) return body;
  return `${body}<span class="t-tilde">${'\n~'.repeat(fill)}</span>`;
}

export interface Crumb {
  /** Directories above the member, root first. */
  readonly trail: readonly string[];
  readonly leaf: string;
}

export function crumbFor(member: Member): Crumb {
  const parts = member.path.split('/');
  const leaf = parts.pop() ?? '';
  return {
    trail: [ROOT, ...parts],
    leaf: member.kind === 'dir' ? `${leaf}/` : leaf,
  };
}

/** Arrow-key navigation over the inspectable members, wrapping at both ends. */
export function stepMember(
  current: string,
  delta: number,
  ids: readonly string[] = MEMBER_IDS,
): string {
  const at = ids.indexOf(current);
  if (at === -1) return ids[0] ?? current;
  return ids[(at + delta + ids.length) % ids.length]!;
}
