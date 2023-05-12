import {writable} from 'svelte/store';

export type Message = string;

export type CodeOutput = ReturnType<typeof createCodeOutput>;


export function createCodeOutput<T = Message>() {
  const {subscribe, set, update} = writable<T[]>([]);

  const prettyWrite = (name: string, data: T[]): void => {
    const output = `<div class="log-${name}">${data.join(',')}</div>`;
    update(n => [...n, output as unknown as T]);
  };

  const log = (...data: T[]) => prettyWrite('info', data);
  const info = (...data: T[]) => prettyWrite('info', data);
  const debug = (...data: T[]) => prettyWrite('debug', data);
  const warn = (...data: T[]) => prettyWrite('warn', data);
  const error = (...data: T[]) => prettyWrite('error', data);

  const write = (...data: T[]) => {
    const msg = data.join(',');
    update(n => [...n, msg as unknown as T]);
  };

  const clear = () => {
    set([]);
  };

  return {
    subscribe,
    log, info, debug, warn, error,
    write,
    clear,
    set
  };
}