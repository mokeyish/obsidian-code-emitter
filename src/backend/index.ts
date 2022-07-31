import languages from './languages';
import type {CodeOutput} from "./store";

export { createCodeOutput } from './store';
export type { CodeOutput } from './store';

export type Backend = {
    loading?: boolean;
    (code: string, output: CodeOutput): Promise<void>
}

export default {
    ...languages
}