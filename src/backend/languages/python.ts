import urlImport from '../../lib/url_import';
import type {Backend, CodeOutput} from '../';
import type { loadPyodide } from 'pyodide/pyodide';
import type { PyodideInterface } from "pyodide/api";

if (typeof process !== 'undefined' && typeof process.browser === 'undefined') {
    process.browser = true;
}

const cdn = 'https://cdn.jsdelivr.net/gh/mokeyish/pyodide-dist@0.21.0a3/';

export default (function() {
    let engine: PyodideInterface;
    let stdio: CodeOutput | undefined = undefined;
    const backend: Backend = async (code, output) => {
        stdio = output;
        await engine.runPythonAsync(code);
    }
    backend.loading = true;

    (async () => {
        const loader = await urlImport<typeof loadPyodide>(
            `${cdn}pyodide.js`,
            () => ( window.loadPyodide )
        )
        engine = await loader({
            indexURL: cdn,
            stdout: (s) => stdio?.write(s),
            stderr:(s) => stdio?.error(s)
        });
    })().then(() => {
        console.log('python loaded.');
        backend.loading = false;
    });



    return backend
})();