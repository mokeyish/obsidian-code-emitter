export type Message = string;

export type CodeOutput = ReturnType<typeof createCodeOutput>;


export function createCodeOutput<T = Message>() {
  let outputs: T[] = [];
  let subscribers: ((m: T[]) =>  void)[] = [];
  
  const update = (setter: (prev: T[]) => T[]) => {
    outputs = setter(outputs);
    for (const s of subscribers) {
      s(outputs);
    }
  };

  const set = (value: T[]) => {
    update(() => value);
  };

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

  const subscribe = (subscriber: (outputs: T[]) =>  void) => {
    subscribers.push(subscriber);
    return () => {
      subscribers = subscribers.filter(s => s !== subscriber);
    };
  };


  return {
    subscribe,
    log, info, debug, warn, error,
    write,
    clear,
    set,
  };
}