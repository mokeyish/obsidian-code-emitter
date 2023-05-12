<script lang="ts">
    import SETTING_DEFAULT from '../setting'
    export let settings = SETTING_DEFAULT
</script>

<div class="setting-item mod-toggle">
    <div class="setting-item-info">
        <div class="setting-item-name">Auto run</div>
        <div class="setting-item-description">Automatically run markdown CodeBlock</div>
    </div>
    <div class="setting-item-control">
        <div class="checkbox-container" class:is-enabled={settings.autoRun} on:click={() => settings.autoRun = !settings.autoRun}>
            <input type="checkbox" value="{settings.autoRun}">
        </div>
    </div>
</div>