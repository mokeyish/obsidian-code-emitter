import type { CodeOutput } from '..';

export default async function (_code: string, output: CodeOutput): Promise<void> {
  // ignore
  output.write('');
}