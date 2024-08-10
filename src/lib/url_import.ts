
export default function <R>(url: string, extract?: ()=>R): Promise<R | undefined> {
  return new Promise((resolve, _reject) => {
    if ((document.head.querySelector(`script[src="${url}"]`))) {
      resolve(extract? extract(): undefined)
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = function () {
      resolve(extract? extract(): undefined)
    }
    document.head.append(script);
  })
}