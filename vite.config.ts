import { defineConfig, Plugin, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import builtins from 'builtin-modules';
import * as fsp from 'fs/promises';
import { relative, normalize } from 'path';
import { rm } from 'fs/promises';
import { exec } from 'child_process';
import UnoCss from '@unocss/vite';
import presetIcons from '@unocss/preset-icons';
import presetMini from '@unocss/preset-mini';
import transformerDirective from '@unocss/transformer-directives';




// https://vitejs.dev/config/
export default  defineConfig(async ({ mode }) => {

  const prod = mode === 'production';
  let { OUT_DIR } = loadEnv(mode, process.cwd(), ['OUT_']);

  await rm('dist', { force: true, recursive: true });
  OUT_DIR = normalize(OUT_DIR);
  if (OUT_DIR != 'dist' && OUT_DIR != path.join(process.cwd(), 'dist')) {
    exec(process.platform === 'win32'? `mklink /J dist ${OUT_DIR}` : `ln -s ${OUT_DIR} dist`);
  }

  const inject = (files: string[]): Plugin => {
    if (files && files.length > 0) {
      return {
        name: 'inject-code',
        async load(this, id, _options?) {
          const info = this.getModuleInfo(id);
          if (info.isEntry) {
            const code = await fsp.readFile(id, 'utf-8');
            const { relative, dirname, basename, extname, join } = path;
            const dir = dirname(id);
            const inject_code = files
              .map(v => relative(dir, v))
              .map(p => join('./', basename(p, extname(p))))
              .map(p => `import './${p}'`).join(';');
            return `
            ${inject_code};
            ${code}
            `;
          }
        },
      };
    }
  };

  return {
    plugins: [
      svelte({
        onwarn: (warning, handler) => {
          if (warning.code.startsWith('a11y')) return;
          handler(warning);
        },
      }),
      UnoCss({
        presets: [
          presetMini(),
          presetIcons({
            cdn: 'https://esm.sh/'
          })
        ],
        transformers:[
          transformerDirective()
        ]
      }),
      prod ? undefined : inject(['src/hmr.ts'])
    ],
    build: {
      lib: {
        entry: 'src/main.ts',
        name: 'main',
        fileName: (_) => 'main.js',
        formats: ['cjs'],
      },
      minify: prod,
      sourcemap: prod ? false : 'inline',
      cssCodeSplit: false,
      // outDir: '',
      rollupOptions: {
        output: {
          exports: 'named',
          assetFileNames: (v) => v.name === 'style.css'? 'styles.css': v.name
        },
        external: [
          'obsidian',
          'electron',
          '@codemirror/autocomplete',
          '@codemirror/closebrackets',
          '@codemirror/collab',
          '@codemirror/commands',
          '@codemirror/comment',
          '@codemirror/fold',
          '@codemirror/gutter',
          '@codemirror/highlight',
          '@codemirror/history',
          '@codemirror/language',
          '@codemirror/lint',
          '@codemirror/matchbrackets',
          '@codemirror/panel',
          '@codemirror/rangeset',
          '@codemirror/rectangular-selection',
          '@codemirror/search',
          '@codemirror/state',
          '@codemirror/stream-parser',
          '@codemirror/text',
          '@codemirror/tooltip',
          '@codemirror/view',
          '@lezer/common',
          '@lezer/highlight',
          '@lezer/lr',
          ...builtins],
      }
    }
  };
});
