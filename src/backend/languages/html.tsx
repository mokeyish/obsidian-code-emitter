import { onCleanup, onMount } from 'solid-js';
import type { Stdio } from '..';
import { render } from 'solid-js/web';

export default async function (code: string, stdio: Stdio): Promise<void> {
  render(() => <HtmlViewer code={code}/>, stdio.viewEl)
}


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