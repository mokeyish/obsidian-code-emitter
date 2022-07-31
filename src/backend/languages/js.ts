import type { CodeOutput } from '..';
import { ProxySandbox } from '../../lib/sandbox';


export default async function (code: string, output: CodeOutput): Promise<void> {

  return new Promise(async (resolve, reject) => {
    const sandbox = new ProxySandbox('t');
    await (async function (window: typeof sandbox.proxy) {
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
    }).bind(sandbox.proxy)(sandbox.proxy);
    resolve();
  });
}
