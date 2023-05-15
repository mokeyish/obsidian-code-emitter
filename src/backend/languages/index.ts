import kotlin from './kotlin';
import rust from './rust';
import cpp from './cpp';
import c from './cpp';
import go from './go';
import js from './js';
import ts from './ts';
import java from './java';
import python from './python';
import csharp from './csharp';
import swift from './swift';
import v from './v';
import wy from './wy';
import type { Backend } from '..';


export default {
  kotlin,
  rust,
  java,
  c,
  cpp,
  'c++': cpp,
  csharp,
  'c#': csharp,
  js,
  javascript: js,
  ts,
  typescript: ts,
  python,
  go,
  swift,
  v,
  vlang: v,
  wy,
  wenyan: wy,
} as {
  [lang: PropertyKey]: Backend
};
