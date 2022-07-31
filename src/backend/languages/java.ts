import type { CodeOutput } from '..';

const url = 'https://api2.sololearn.com/v2/codeplayground/v2/compile';


export default async function (code: string, output: CodeOutput): Promise<void> {
    const param = {
        code,
        language: 'java',
        input: '',
        codeId: null,
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
        mode: "cors",
    })

    const data: {
        success: boolean,
        errors: [],
        data: {
            sourceCode: string,
            output: string,
            language: string
        }
    } = await res.json();
    if (data.errors && data.errors.length > 0) {
        data.errors.forEach(e => output.error(e));
        return
    }
    output.write(data.data.output);
}