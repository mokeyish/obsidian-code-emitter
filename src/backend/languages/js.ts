import type { CodeOutput } from '..';
import { ProxySandbox } from '../../lib/sandbox';


export default async function (code: string, output: CodeOutput): Promise<void> {

  return new Promise((resolve, reject) => {
    const sandbox = new ProxySandbox('t');
    let run = (async function (window: typeof sandbox.proxy) {
      const { console } = window;
      Object.assign(console, output);
      sandbox.active();
      try {
        await eval(code);
      } catch (e) {
        console.error(e);
      }
      finally {
        sandbox.inactive();
      }
    });
    run = run.bind(sandbox.proxy);
    (run(sandbox.proxy)).then(resolve).catch(reject);
  });
}
