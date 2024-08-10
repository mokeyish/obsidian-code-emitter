import { MarkdownRenderChild, PluginSettingTab, type Plugin } from 'obsidian';
import { Component as SolidComponent, splitProps } from 'solid-js';
import { render } from 'solid-js/web';


export class PluginSolidSettingTab<C extends SolidComponent, P extends Plugin> extends PluginSettingTab {
  cleanup?: () => void;
  constructor(
    plugin: P,
    private readonly component: C,
    private readonly props: Parameters<C>[0]) {
    super(plugin.app, plugin);
  }
  display() {
    this.cleanup = render(() => this.component(this.props), this.containerEl);
  }
  hide() {
    this.cleanup?.();
  }
}

/**
 * MarkdownRenderSolidChild
 * 
 * auto tree-shaking
 */
export class MarkdownRenderSolidChild<T extends SolidComponent> extends MarkdownRenderChild {
  constructor(private readonly component: T, private readonly props: { containerEl: HTMLElement } & Parameters<T>[0]) {
    super(props.containerEl);
  }
  onload(): void {
    const [local, other] = splitProps(this.props, ['containerEl']);
    this.onunload = render(() => this.component(other), local.containerEl);
  }
}