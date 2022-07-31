import {writable} from 'svelte/store';

export type Message = string;

export type CodeOutput = ReturnType<typeof createCodeOutput>;


export function createCodeOutput<T = Message>() {
    const {subscribe, set, update} = writable<T[]>([]);

    const prettyWrite = (name: string, id: string, data: T[]): void => {
        const output = `[<span class="log-${name}">${id}</span>]:${data.join(',')}`;
        update(n => [...n, output as unknown as T])
    }

    const log = (...data: T[]) => prettyWrite('log', 'LOG', data);
    const info = (...data: T[]) => prettyWrite('log', 'INFO', data);
    const debug = (...data: T[]) => prettyWrite('debug', 'DBG', data);
    const warn = (...data: T[]) => prettyWrite('warn', 'WRN', data);
    const error = (...data: T[]) => prettyWrite('error', 'ERR', data);

    const write = (...data: T[]) => {
        const msg = data.join(',');
        update(n => [...n, msg as unknown as T]);
    }

    const clear = () => {
        set([])
    }

    return {
        subscribe,
        log, info, debug, warn, error,
        write,
        clear,
        set
    }
}