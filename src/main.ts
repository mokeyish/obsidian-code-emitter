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
            const k = backend[lang]
            if (k && k.loading !== true) {
                ctx.addChild(new CodeRunWidgetView(codeEl.parentElement, lang, codeEl.getText()));
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

    constructor(containerEl: HTMLElement, private lang: string, private code: string) {
        super(containerEl);
    }

    onload() {
        const {containerEl, lang, code} = this
        this.widget = new RunWidget({
            target: containerEl,
            props: {lang, code}
        })
    }

    onunload() {
        this.widget?.$destroy();
    }
}


