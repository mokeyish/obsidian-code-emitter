<script lang="ts">
    import backend, {createCodeOutput} from "./backend";
    import CodeRunning from "./CodeRunning.svelte";
    import {onMount} from "svelte";

    export let lang: string;
    export let code: string;

    const output = createCodeOutput();

    let running = false;

    $: hasResult = $output.length > 0;

    const runCode = async () => {
        running = true;
        await backend[lang](code, output);
        running = false;
    };

    onMount(async () => {
        await runCode();
    });
</script>

<div class="code-emitter-block">
    {#if !running && !hasResult}
        <i class="button-run-code fa-solid fa-play" on:click={runCode}></i>
    {/if}

    {#if running || hasResult}
        <hr class="seprator"/>
        <div class="code-output">
            {#if running}
                <div class="loadding">
                    <CodeRunning/>
                </div>
            {:else}
                <i class="button-refresh-code fa-solid fa-xmark" on:click={output.clear}></i>
                <ul>
                    {#each $output as line}
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