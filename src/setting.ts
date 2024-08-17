export interface PluginSetting {
    autoRun: boolean,
}

export default {
  autoRun: false,
  python: {
    cdn: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
  }
} as PluginSetting;