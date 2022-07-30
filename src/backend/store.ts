import {writable} from 'svelte/store';

type Message = string;

export type CodeOutput = ReturnType<typeof createCodeOutput>;


export function createCodeOutput() {
    const {subscribe, set, update} = writable<Message[]>([]);

    const prettyWrite = (name: string, id: string, data: Message[]): void => {
        const output = `[<span class="log-${name}">${id}</span>]:${data.join(',')}`;
        update(n => [...n, output])
    }

    const log = (...data: Message[]) => prettyWrite('log', 'LOG', data);
    const info = (...data: Message[]) => prettyWrite('log', 'INFO', data);
    const debug = (...data: Message[]) => prettyWrite('debug', 'DBG', data);
    const warn = (...data: Message[]) => prettyWrite('warn', 'WRN', data);
    const error = (...data: Message[]) => prettyWrite('error', 'ERR', data);

    const write = (...data: Message[]) => {
        const msg = data.join(',');
        update(n => [...n, msg]);
    }

    const clear = () => {
        set([])
    }

    return {
        subscribe,
        log, info, debug, warn, error,
        write,
        clear
    }
}