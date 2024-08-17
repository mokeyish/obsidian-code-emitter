import type { Stdio } from '..';
import { ClientAgent } from '../../version';

const url = 'https://api.kotlinlang.org//api/1.7.10/compiler/run';

interface KotlinArgs {
  args: string,
  confType: 'java',
  files: {
    name: string,
    publicId: string,
    text: string
  }[]
}


export default async function(code: string, stdio: Stdio): Promise<void> {
  const body: KotlinArgs = {
    args: '',
    confType: 'java',
    files: [
      {
        name: 'File.kt',
        publicId: '',
        text: code
      }
    ]
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': ClientAgent,
      'Client-Agent': ClientAgent,
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  });

  const data: {
    errors: {
      [f: string]: Array<{
        message: string,
        severity: string
      }>
    },
    text: string
  } = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    for (const errors of Object.values(data.errors)) {
      for (const error of errors) {
        stdio.stderr(error.message);
      }
    }
  }
  stdio.stdout(data.text);
}