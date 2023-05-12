import type { CodeOutput } from '..';
import { run } from '../providers/sololearn';

export default async function (code: string, output: CodeOutput): Promise<void> {
  const res = await run(code, 'cpp');
  output.write(res.success ? res.data.output : (res.errors ?? []).join('\n'));
}