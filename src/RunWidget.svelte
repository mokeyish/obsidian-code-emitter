<script lang="ts">
    import backend, {createCodeOutput} from "./backend";
    import CodeRunning from "./CodeRunning.svelte";
    import {onMount, onDestroy} from "svelte";
    import md5 from 'crypto-js/md5';

    interface Cache {
        [code: string]: {
            lastAccessTime: number,
            outputs: string[]
        }
    }

    export let lang: string;
    export let code: string;
    export let sourcePath: string;
    export let autoRun: boolean = false

    $: cacheKey = `code-emitter-cache-${sourcePath}`;
    $: codeSum = md5(code).toString();

    const codeOutput = createCodeOutput();

    let outputs: string[];
    codeOutput.subscribe(v => outputs = v);

    let running = false;

    $: hasResult = outputs.length > 0;

    const runCode = async () => {
        running = true;
        await backend[lang](code, codeOutput);
        running = false;
    };

    const readFromCache = () => {
        const a = localStorage.getItem(cacheKey);
        if (!a) {
            return undefined;
        }
        const b = <Cache>JSON.parse(a);
        const c = b[codeSum];
        if (!c) {
            return undefined;
        }
        return c.outputs;
    }
    const writeToCache = () => {
        const a = localStorage.getItem(cacheKey);
        const b: Cache = a ? JSON.parse(a) : {}
        b[codeSum] = {
            outputs,
            lastAccessTime: Date.now()
        }
        localStorage.setItem(cacheKey, JSON.stringify(b));
    }

    onMount(async () => {
        const r = readFromCache();
        if (r) {
            codeOutput.set(r);
        } else if (autoRun) {
            await runCode();
        }
    });
    onDestroy(writeToCache);
</script>

<div class="code-emitter-block">
    {#if !running && !hasResult}
        <i class="button-run-code i-fa6-solid:play" on:click={runCode}></i>
    {/if}

    {#if running || hasResult}
        <hr class="seprator"/>
        <div class="code-output">
            {#if running}
                <div class="loadding">
                    <CodeRunning/>
                </div>
            {:else}
                <i class="button-refresh-code i-fa6-solid:xmark" on:click={codeOutput.clear}></i>
                <ul>
                    {#each outputs as line}
                        <li>{@html line}</li>
                    {/each}
                </ul>
            {/if}
        </div>
    {/if}
</div>


<style lang="scss">

  :global {
    pre:hover .button-run-code {
      display: block;
    }
  }

  .code-emitter-block {
    white-space: nowrap;
  }

  .button-run-code {
    // display: none;
    position: absolute;
    bottom: 1em;
    right: 1em;
  }

  .button-refresh-code {
    display: none;
    position: absolute;
    top: 0.5em;
    right: 1em;
  }

  .code-output:hover .button-refresh-code {
    display: block;
  }


  .loadding {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .seprator {
    margin: 0.7em 0;
  }

  .code-output {
    padding: 1em;
    white-space: nowrap;
    position: relative;
    font-size: 0.85em;

    &>ul{
      list-style: none;
      padding: 0;
      margin: 0;

      &>li {
        white-space: pre-line;
      }
    }
  }
</style>