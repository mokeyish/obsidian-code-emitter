# Obsidian Code Emitter

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/mokeyish/obsidian-code-emitter?display_name=tag&include_prereleases)
![GitHub all releases](https://img.shields.io/github/downloads/mokeyish/obsidian-code-emitter/total?style=flat-square)

This plugin allows code blocks executed interactively like jupyter notebooks. It is based on HTTP REST APIs and JS sandbox and Webassembly technology, and has no local environment requirements, so it supports all platforms supported by Obsidian.

Supports all Obsidian supported platforms, includes:
- Windows
- MacOS
- Linux
- Android
- IOS

Currently, support languages:

- Rust
- Kotlin
- JavaScript
- TypeScript
- Python
- Java

**Note**: Only `Python`、`TypeScript`、`JavaScript` are run locally in sandbox(js / webassembly). Other's will send
code to third-party website to eval the results (eg: https://play.kotlinlang.org, https://play.rust-lang.org).
Please take care to avoid sending your potentially-sensitive source code.


**Ads**: You might like my other plugins 🤪

- [Obsidian Enhancing Export](https://github.com/mokeyish/obsidian-enhancing-export)

---

![.](./screenshots/code-emitter.gif)

## Installation

1. Create plugin folder `<your obsidian vault>/.obsidian\plugins\code-emitter`
2. Download files from [releases](https://github.com/mokeyish/obsidian-code-emitter/releases) into plugin folder.

## Examples

### Python

Install numpy through `micropip`. All available packages are list in [here](https://github.com/mokeyish/pyodide-dist/find/master) (search `whl`).

```python
import micropip
await micropip.install('numpy')  
import numpy as np
a = np.random.rand(3,2)
b = np.random.rand(2,5)

print(a@b)
```

## License

This plugin sandbox contains codes from [https://github.com/umijs/qiankun](https://github.com/umijs/qiankun/blob/master/src/sandbox/index.ts), which is licensed under

- MIT license (LICENSE-MIT or [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT))

And other codes is licensed under

- GPL-3.0 license (LICENSE-GPL-3.0 or [https://opensource.org/licenses/GPL-3.0](https://opensource.org/licenses/GPL-3.0))
