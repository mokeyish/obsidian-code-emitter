import urlImport from '../../lib/url_import';
import type { Backend, Stdio } from '..';
import type * as typescript from 'typescript';

import js from './js';

const cdn = 'https://cdn.jsdelivr.net/npm/typescript@4.7.4/lib/typescript.min.js';

export default (function () {
  let tsc: typeof typescript | null = null;
  let load: (() => Promise<void>) | null = null;
  const backend: Backend = async function(code: string, stdio: Stdio): Promise<void> {
    if (!tsc) {
      await load();
    }
    const jsCode = tsc.transpile(`(async () => { ${code} })();`, {
      module: tsc.ModuleKind.ESNext,
      target: tsc.ScriptTarget.ES2018
    });
    await js(jsCode, stdio);
  };
  backend.loading = true;

  load = async () => {
    tsc = await urlImport<typeof typescript>(cdn, () => window.ts);
    backend.loading = false;
    console.log('typescript loaded.');
  };

  return backend;
})() as Backend;