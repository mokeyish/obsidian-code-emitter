import './Play.scss';
import { createSignal, For, type JSX, onCleanup, onMount, Show } from 'solid-js';
import backend, { createCodeOutput } from '../backend';
import Spin from './Spin';
import md5 from 'crypto-js/md5';

interface CacheEntry {
  [code: string]: {
      lastAccessTime: number,
      outputs: string[]
  }
}

export default (props: {
  lang: string,
  code: string,
  sourcePath: string,
  autoRun?: boolean
}) => {

  const cacheKey = () => `code-emitter-cache-${props.sourcePath}`;
  const codeSum = () => md5(props.code).toString();
  const codeOutput = createCodeOutput();
  const [outputs, setOuptuts] = createSignal<string[]>();
  codeOutput.subscribe(setOuptuts);

  const hasResult = () => outputs()?.length > 0;

  const [running, setRunning] = createSignal(false);

  const run = async () => {
    setRunning(true);
    try {
      await backend[props.lang](props.code, codeOutput);
    } finally {
      setRunning(false);
    }
  };


  const readFromCache = () => {
    const a = localStorage.getItem(cacheKey());
    if (!a) {
      return undefined;
    }
    const b = JSON.parse(a) as CacheEntry;
    const c = b[codeSum()];
    if (!c) {
      return undefined;
    }
    return c.outputs;
  };
  const writeToCache = () => {
    const a = localStorage.getItem(cacheKey());
    const b: CacheEntry = a ? JSON.parse(a) : {};
    b[codeSum()] = {
      outputs: outputs(),
      lastAccessTime: Date.now()
    };
    localStorage.setItem(cacheKey(), JSON.stringify(b));
  };

  onMount(async () => {
    const r = readFromCache();
    if (r) {
      codeOutput.set(r);
    } else if (props.autoRun) {
      await run();
    }
  });

  onCleanup(writeToCache);

  return <>
    <div class="code-emitter-block solid">
      <Show when={ !running() && !hasResult()}>
        {/* <i class=" i-fa6-solid:play" ></i> */}
        <PlayButton class="button-play" onClick={run}/>
      </Show>

      <Show when={running() || hasResult() }>
        <hr class="code-seprator"/>
        <div class="code-output">
          <Show when={running()} fallback={<>
            
            <Show when={props.lang === 'html' } fallback={<>
              <ul>
                <For each={outputs()}>
                  {(line) => <li innerHTML={line}></li>}
                </For>
              </ul>
            </>}>
              <HtmlViewer code={props.code}/>
            </Show>

            <ClearButton class="button-clear" onClick={codeOutput.clear}/>
          </>}>

            <div class="loadding">
              <Spin/>
            </div>
          </Show>
        </div>

      </Show>
    </div>
  </>;
};

const ClearButton = (props:  JSX.HTMLAttributes<HTMLElement>) => {
  return <>
    <i aria-label="clear" {...props}>
      <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512">
        <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7L86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256z"/>
      </svg>
    </i>
  </>;
};


const PlayButton = (props:  JSX.HTMLAttributes<HTMLElement>) => {
  return <>
    <i aria-label="play" {...props}>
      <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512">
        <path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.4 33.4 24.5 41.9S58.2 482 73 473l288-176c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41z"/>
      </svg>
    </i>
  </>;
};


const HtmlViewer = (props: { code: string }) => {
  // eslint-disable-next-line prefer-const
  let host: HTMLDivElement | undefined = undefined;
  // eslint-disable-next-line prefer-const
  let el: HTMLDivElement | undefined = undefined;

  let shadow: ShadowRoot | undefined = undefined;

  onMount(() => {
    if (!host) return;
    shadow = host.attachShadow({ mode: 'closed' });
    shadow.appendChild(el);
  });

  onCleanup(() => {
    host?.detach();
  });

  return <>
    <div ref={host} class="html-viewer" >
      <div ref={el} innerHTML={props.code}></div>
    </div>
  </>;
};