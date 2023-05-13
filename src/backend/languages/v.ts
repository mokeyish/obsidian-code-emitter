import type { CodeOutput } from '..';

const url = 'https://play.vosca.dev/run';

export default async function (code: string, output: CodeOutput): Promise<void> {
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
    output.error(json.error);
  } else {
    output.write(json.output);
  }
}