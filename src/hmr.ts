import type {Plugin} from 'obsidian';
import {debounce, Platform} from 'obsidian';
import { normalize, join} from 'path';

declare global {
    interface Window {
        hmr: typeof hmr
    }
}

const hmr = (plugin: Plugin, wait= 500) => {
    if (Platform.isMobile) {
        return;
    }

    console.log(`[hmr: ${plugin.manifest.name}]`);

    const {
        app: {
            vault: {adapter},
            plugins,
        },
        manifest: {dir: pluginDir, id},
    } = plugin;
    const {
        app: {vault},
    } = plugin;
    const entry = normalize(join(pluginDir, 'main.js'));
    const onChange = async (file: string) => {
        if (file.startsWith(pluginDir)) {
            if (!await adapter.exists(entry)) {
                return
            }
            await plugins.disablePlugin(id);
            await plugins.enablePlugin(id);
        }
    };

    plugin.registerEvent(vault.on('raw', debounce(onChange, wait)));

    plugin.register(() => adapter.stopWatchPath(pluginDir));
    adapter.startWatchPath(pluginDir);
}

if (!window.hmr) {
    Window.prototype.hmr = hmr
}
export {};
