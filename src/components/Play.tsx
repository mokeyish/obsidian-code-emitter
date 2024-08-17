import './Play.scss';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import backend, { createStdio } from '../backend';
import Spin from './Spin';
import md5 from 'crypto-js/md5';
import Term from './Term';
import Icon from './Icon';

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
  const stdio = createStdio();
  const [outputs, setOuptuts] = createSignal<string[]>();
  stdio.subscribe(setOuptuts);

  const hasResult = () => outputs()?.length > 0 || stdio.viewEl.hasChildNodes();

  const [running, setRunning] = createSignal(false);

  const run = async () => {
    setRunning(true);
    try {
      const engine = backend[props.lang];
      await engine(props.code, stdio);
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
      stdio.set(r);
    } else if (props.autoRun) {
      await run();
    }
  });

  onCleanup(writeToCache);

  return <>
    <div class="code-emitter-block solid">
      <Show when={ !running() && !hasResult()}>
        <i aria-label="play" class="button-play" onClick={run}><Icon name="play"/></i>
      </Show>

      <Show when={running() || hasResult() }>
        <hr class="code-seprator"/>
        <div class="code-output">
          <Show when={running()} fallback={<>
            <div>{stdio.viewEl}</div>
            <Term lines={outputs()}/>
            <i aria-label="clear" class="button-clear" onClick={stdio.clear}><Icon name="clear"/></i>
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