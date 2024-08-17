import type { Stdio } from '..';
import { run } from '../providers/sololearn';

export default async function (code: string, stdio: Stdio): Promise<void> {
  const res = await run(code, 'java');
  if (res.success) {
    stdio.stdout(res.data.output);
  } else {
    stdio.stderr((res.errors ?? []).join('\n'))
  }
}