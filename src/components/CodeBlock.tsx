import Play from './Play';
import { loadPrism } from 'obsidian';


export default (props: { lang: string, code: string, sourcePath: string, autoRun: boolean } ) => {
  const highlightElement = async (el: HTMLElement) => {
    const prism = await loadPrism();
    prism.highlightElement(el);
  };
  const language = () => `language-${props.lang}`;
  return <>
    <pre class={ language() }>
      <code ref={highlightElement}>{props.code}</code>
      <Play {...props}/>
    </pre>
  </>;
};