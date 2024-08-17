import type { Stdio } from '..';

const url = 'https://play.crystal-lang.org/run_requests';

export default  async function(code: string, stdio: Stdio): Promise<void> {
  const data = {
    run_request: {
      language: 'crystal', 
      version: '1.8.2', 
      code
    }
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
  const json = await res.json();
  const codeResponse = json.run_request.run;
  // the response doesnt have success 
  if (codeResponse.stderr) {
    stdio.stderr(codeResponse.stderr)
  } else {
    stdio.stdout(codeResponse.stdout);
  }
}