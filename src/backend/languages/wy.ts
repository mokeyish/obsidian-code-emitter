import urlImport from '../../lib/url_import';
import type {Backend, CodeOutput} from '..';
import js from './js';

const cdn = 'https://unpkg.com/@wenyan/core/index.min.js';

export default (function () {
  let wenyan: {
    compile: (code: string) => string
  } | null = null;
  let load: (() => Promise<void>) | null = null;
  const backend: Backend = async function(code: string, output: CodeOutput): Promise<void> {
    if (!wenyan) {
      await load();
    }
    const jsCode = wenyan.compile(code);
    console.log('wenyan:');
    console.log(jsCode);
    await js(`(async () => { ${jsCode} })();`, output);
  };
  backend.loading = true;

  load = async () => {
    wenyan = await urlImport<typeof wenyan>(cdn, () => window.Wenyan);
    backend.loading = false;
    console.log('wenyan loaded.');
  };

  return backend;
})() as Backend;