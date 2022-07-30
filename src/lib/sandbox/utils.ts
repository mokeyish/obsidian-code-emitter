

export const nativeGlobal = new Function('return this')();

const fnRegexCheckCacheMap = new WeakMap<any | FunctionConstructor, boolean>();

export function isConstructable(fn: () => any | FunctionConstructor) {
  // prototype methods might be changed while code running, so we need check it every time
  const hasPrototypeMethods =
    fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;

  if (hasPrototypeMethods) return true;

  if (fnRegexCheckCacheMap.has(fn)) {
    return fnRegexCheckCacheMap.get(fn);
  }

  /*
    1. 有 prototype 并且 prototype 上有定义一系列非 constructor 属性
    2. 函数名大写开头
    3. class 函数
    满足其一则可认定为构造函数
   */
  let constructable = hasPrototypeMethods;
  if (!constructable) {
    // fn.toString has a significant performance overhead, if hasPrototypeMethods check not passed, we will check the function string with regex
    const fnString = fn.toString();
    const constructableFunctionRegex = /^function\b\s[A-Z].*/;
    const classRegex = /^class\b/;
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }

  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}




/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */
 const naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
 const callableFnCacheMap = new WeakMap<CallableFunction, boolean>();
 export const isCallable = (fn: any) => {
   if (callableFnCacheMap.has(fn)) {
     return true;
   }
 
   const callable = naughtySafari ? typeof fn === 'function' && typeof fn !== 'undefined' : typeof fn === 'function';
   if (callable) {
     callableFnCacheMap.set(fn, callable);
   }
   return callable;
 };


 const boundedMap = new WeakMap<CallableFunction, boolean>();
 export function isBoundedFunction(fn: CallableFunction) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}
 