
import { ClientAgent } from '../../version';

const url = 'https://api2.sololearn.com/v2/codeplayground/v2/compile';


export const run = async (code: string, lang: 'cpp' | 'go' | 'c' | 'java' | 'cs' | 'swift') => {
  const header = {
    'User-Agent': ClientAgent,
    'Client-Agent': ClientAgent,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    'Content-Type': 'application/json',
  };
		
  const res = await fetch(url, {
    'headers': header,
    'body': JSON.stringify({
      'code': code,
      'codeId': null,
      'input': '',
      'language': lang
    }),
    'method': 'POST',
  });
  return (await res.json()) as {
    success: boolean,
    errors: string[],
    data: {
      sourceCode: number,
      status: number,
      errorCode: number,
      output: string,
      date: string,
      language: string,
      input: string,
    }
  };
};