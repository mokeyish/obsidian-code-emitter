import type { Stdio } from '..';

const url = 'https://play.rust-lang.org/execute';

export default async function(code: string, stdio: Stdio): Promise<void> {
  const data = {
    'channel': 'stable',
    'mode': 'debug',
    'edition': '2021',
    'crateType': 'bin',
    'tests': false,
    'code': code,
    'backtrace': false
  };

  const res = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );
  const out = await res.json();
  if (out.success) {
    stdio.stdout(out.stdout)
  } else {
    stdio.stderr(out.stderr);
  }
}