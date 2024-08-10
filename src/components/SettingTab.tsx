import type { PluginSetting } from '../setting';
import type { SetStoreFunction } from 'solid-js/store';


export default (props: { settings: PluginSetting, settingsUpdate: SetStoreFunction<PluginSetting> } ) => {
  
  return <>
    <div class="setting-item mod-toggle">
      <div class="setting-item-info">
        <div class="setting-item-name">Auto run</div>
        <div class="setting-item-description">Automatically run markdown CodeBlock</div>
      </div>
      <div class="setting-item-control">
        <div class="checkbox-container" classList={ { 'is-enabled': props.settings.autoRun }}  onClick={() => props.settingsUpdate('autoRun', (v) => !v)}>
          <input type="checkbox" checked={props.settings.autoRun} />
        </div>
      </div>
    </div>
  </>;
};
