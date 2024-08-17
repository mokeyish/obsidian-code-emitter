import type { CodeOutput as StdIO } from '..';

const url = 'https://play.vosca.dev/run';

export default async function (code: string, output: StdIO): Promise<void> {
  const data = new FormData();
  data.append('code', code);
  const res = await fetch(url, {
    method: 'POST',
    body: data
  });

  const json = await res.json() as {
    output: string,
    buildOutput: string,
    error: string
  };

  if (json.error?.length > 0) {
    output.stderr(json.error);
  } else {
    output.stdout(json.output);
  }
}