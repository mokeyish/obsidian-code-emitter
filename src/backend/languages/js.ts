import type { Stdio } from '..';
import { ProxySandbox } from '../../lib/sandbox';



export default async function (code: string, output: Stdio): Promise<void> {

  return new Promise((resolve, reject) => {
    const sandbox = new ProxySandbox('t');
    let run = (async function (window: typeof sandbox.proxy) {
      const { console } = window;
      Object.assign(console, wrapConsole(output));
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

const wrapConsole = ({ update }: Stdio) => {
  const prettyWrite = (name: string, data: string[]): void => {
    const output = `<div class="log-${name}">${data.join(',')}</div>`;
    update(n => [...n, output as unknown as string]);
  };

  const log = (...data: string[]) => prettyWrite('info', data);
  const info = (...data: string[]) => prettyWrite('info', data);
  const debug = (...data: string[]) => prettyWrite('debug', data);
  const warn = (...data: string[]) => prettyWrite('warn', data);
  const error = (...data: string[]) => prettyWrite('error', data);

  return {
    log,
    info,
    debug,
    warn,
    error,
  }
}