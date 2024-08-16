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
    write,
    clear,
    update,
    set,
  };
}