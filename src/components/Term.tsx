
import { For, Show } from 'solid-js';
import { parse } from 'ansicolor';

const htmlRegex = /^\s*<([a-zA-Z_][a-zA-Z0-9-_]*)(\s+[^>]+)*>.*<\/\1>\s*$/
export default (props: { lines: string[] }) => {
  return <>
    <ul>
      <For each={props.lines}>
        {(line) => <Show when={!htmlRegex.test(line)} fallback={<li innerHTML={line}></li>}>
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
