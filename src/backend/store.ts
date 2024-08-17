export type Message = string;
export type Stdio = ReturnType<typeof createStdio>;

export function createStdio<T = Message>() {
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

  const write = (...data: T[]) => {
    const msg = data.join(',');
    update(n => [...n, msg as unknown as T]);
  };

  const stderr = (...data: T[]) => {
    const msg = data.join(',');
    update(n => [...n, msg as unknown as T]);
  };

  const viewEl = document.createElement('div');
  const clear = () => {
    set([]);
    viewEl.empty();
  };

  const subscribe = (subscriber: (outputs: T[]) =>  void) => {
    subscribers.push(subscriber);
    return () => {
      subscribers = subscribers.filter(s => s !== subscriber);
    };
  };


  return {
    subscribe,
    write,
    viewEl,
    stdout: write,
    stderr,
    clear,
    update,
    set,
  };
}