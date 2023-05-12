import 'uno.css';
import './style.css';
import type {MarkdownPostProcessorContext} from 'obsidian';
import {Plugin, MarkdownRenderChild, PluginSettingTab, App} from 'obsidian';
import backend from './backend';
import RunWidget from './components/RunWidget.svelte';
import SettingTab from './components/SettingTab.svelte';

import SETTING_DEFAULT from './setting';


const langPrefix = 'language-';



export default class CodeEmitterPlugin extends Plugin {
  settings: typeof SETTING_DEFAULT;
  async injectRunCode(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    const codeEl = el.querySelector('pre>code');
    if (codeEl && codeEl.className.startsWith(langPrefix)) {
      const lang = codeEl.className.substring(langPrefix.length).toLowerCase();
      if (backend[lang]) {
        ctx.addChild(new CodeRunWidgetView(
          this,
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
    // Platform.isDesktop && window.hmr && window.hmr(this, 2000);

    await this.loadSettings();

    this.addSettingTab(new SettingTabView(this.app, this));


    this.registerMarkdownPostProcessor(this.injectRunCode.bind(this), -1);
  }

  async unload() {
    await this.saveSettings();
    super.unload();
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, SETTING_DEFAULT, await this.loadData());
  }
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

export class SettingTabView extends PluginSettingTab {
  readonly plugin: CodeEmitterPlugin;
  view?: SettingTab;

  constructor(app: App, plugin: CodeEmitterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): any {
    const { containerEl } = this;

    this.view = new SettingTab({
      target: containerEl,
      props: {
        settings: this.plugin.settings
      }
    });
  }

  hide(): any {
    this.view?.$destroy();
    return super.hide();
  }

}


class CodeRunWidgetView extends MarkdownRenderChild {
  readonly plugin: CodeEmitterPlugin;
  widget?: RunWidget;
  lang: string;
  code: string;
  sourcePath: string;

  constructor(plugin: CodeEmitterPlugin, containerEl: HTMLElement, lang: string, code: string, sourcePath: string) {
    super(containerEl);
    this.plugin = plugin;
    this.lang = lang;
    this.code = code;
    this.sourcePath = sourcePath;
  }

  onload() {
    const {containerEl, lang, code, sourcePath} = this;
    this.widget = new RunWidget({
      target: containerEl,
      props: {lang, code, sourcePath, autoRun: this.plugin.settings.autoRun}
    });
  }

  onunload() {
    this.widget?.$destroy();
  }
}


