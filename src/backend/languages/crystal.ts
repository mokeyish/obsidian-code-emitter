import type { CodeOutput } from '..';

const url = 'https://play.crystal-lang.org/run_requests';

export default  async function(code: string, output: CodeOutput): Promise<void> {
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
  output.write(!codeResponse.stderr ? codeResponse.stdout : codeResponse.stderr);
}