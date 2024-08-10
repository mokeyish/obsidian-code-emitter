import urlImport from '../../lib/url_import';
import type { Backend, CodeOutput } from '../';
import type { loadPyodide } from 'pyodide/pyodide';
import type { PyodideInterface } from 'pyodide/api';

if (typeof process !== 'undefined' && typeof process.browser === 'undefined') {
  process.browser = true;
}

const cdn = 'https://cdn.jsdelivr.net/gh/mokeyish/pyodide-dist@0.21.2/';

export default (function() {
  let engine: PyodideInterface | null = null;
  let stdio: CodeOutput | null = null;
  let load: (() => Promise<void>) | null = null;
  const backend: Backend = async (code, output) => {
    if (!engine) {
      await load();
    }
    stdio = output;
    try {
      await engine.runPythonAsync(code);
    } catch (e) {
      output.error(e);
    }
  };
  backend.loading = true;
  load = async () => {
    const loader = await urlImport<typeof loadPyodide>(
      `${cdn}pyodide.js`,
      () => ( window.loadPyodide )
    );
    engine = await loader({
      indexURL: cdn,
      stdout: (s) => stdio?.write(s),
      stderr:(s) => stdio?.error(s)
    });
    await engine.loadPackage('micropip');
    console.log('python loaded.');
    backend.loading = false;
  };
  return backend;
})();