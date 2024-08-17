import languages from './languages';
import type { Stdio } from './store';

export { createStdio } from './store';
export type { Stdio } from './store';

export type Backend = {
    loading?: boolean;
    (code: string, output: Stdio): Promise<void>
}


export default {
  ...languages,
};