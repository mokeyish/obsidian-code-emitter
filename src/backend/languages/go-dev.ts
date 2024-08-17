import type { Stdio } from '..';

const url = 'https://go.dev/_/compile?backend=';

export default async function(code: string, _stdio: Stdio): Promise<void> {
  const data = new URLSearchParams({
    version: '2',
    body: code,
    withVet: 'true'
  });

  const res = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data,
      mode: 'no-cors'
    }
  );
  const json = await res.json();
  return json.Events[0].Message;
}