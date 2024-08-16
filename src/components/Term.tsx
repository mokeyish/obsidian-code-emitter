
import { For, Show } from 'solid-js';
import { parse } from 'ansicolor';

export default (props: { lines: string[] }) => {
  return <>
    <ul>
      <For each={props.lines}>
        {(line) => <Show when={!line.startsWith('<div')} fallback={<li innerHTML={line}></li>}>
          <li>
            <For each={parse(line ?? '').spans}>
              {(s) => <span style={s.css + (s.color ? `color;${s.color}` : '')} >{s.text}</span>}
            </For>
          </li>
        </Show>}
      </For>
    </ul>
  </>
}
