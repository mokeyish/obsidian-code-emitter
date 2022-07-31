import type { CodeOutput } from '..';

const url = 'https://play.rust-lang.org/execute';

export default  async function(code: string, output: CodeOutput): Promise<void> {
    const data = {
        "channel": "stable",
        "mode": "debug",
        "edition": "2021",
        "crateType": "bin",
        "tests": false,
        "code": code,
        "backtrace": false
    }

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
    output.write(json.success ? json.stdout : json.stderr);
}