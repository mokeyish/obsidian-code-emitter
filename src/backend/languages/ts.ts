import type { CodeOutput } from '..';

import * as ts from 'typescript';
import {ScriptTarget} from 'typescript';

import js from './js';

export default async function run(code: string, output: CodeOutput): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let jsCode = ts.transpile(`(async () => { ${code} })();`, {
            module: ts.ModuleKind.ESNext,
            target: ScriptTarget.ES2018
        });
        await js(jsCode, output);
        resolve();
    })
}