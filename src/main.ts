import type {MarkdownPostProcessorContext} from 'obsidian';
import {Plugin, Platform, MarkdownRenderChild} from 'obsidian';
import backend from "./backend";
import RunWidget from './RunWidget.svelte';
import './app.scss';

const langPrefix = 'language-';


export default class MyPlugin extends Plugin {

    async injectRunCode(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        const codeEl = el.querySelector('pre>code');
        if (codeEl && codeEl.className.startsWith(langPrefix)) {
            const lang = codeEl.className.substring(langPrefix.length).toLowerCase();
            if (backend[lang]) {
                ctx.addChild(new CodeRunWidgetView(
                    codeEl.parentElement,
                    lang,
                    codeEl.getText(),
                    ctx.sourcePath
                ));
            }
        } else {
            // console.log(el, ctx);
        }
    }

    async onload() {
        Platform.isDesktop && window.hmr && window.hmr(this);

        // await this.loadSettings();

        this.registerMarkdownPostProcessor(this.injectRunCode.bind(this), -1);
    }
}


class CodeRunWidgetView extends MarkdownRenderChild {
    widget?: RunWidget;
    lang: string;
    code: string;
    sourcePath: string;

    constructor(containerEl: HTMLElement, lang: string, code: string, sourcePath: string) {
        super(containerEl);
        this.lang = lang;
        this.code = code;
        this.sourcePath = sourcePath;
    }

    onload() {
        const {containerEl, lang, code, sourcePath} = this
        this.widget = new RunWidget({
            target: containerEl,
            props: {lang, code, sourcePath}
        })
    }

    onunload() {
        this.widget?.$destroy();
    }
}


