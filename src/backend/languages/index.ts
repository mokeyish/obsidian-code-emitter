import kotlin from './kotlin';
import rust from './rust';
import cpp from './cpp';
import c from './cpp';
import go from './go';
import hs from './haskell';
import js from './js';
import ts from './ts';
import java from './java';
import python from './python';
import csharp from './csharp';
import swift from './swift';
import v from './v';
import wy from './wy';
import crystal from './crystal';
import r from './r';
import html from './html';
import type { Backend } from '..';


export default {
  kotlin,
  rust,
  java,
  c,
  cpp,
  // 'c++': cpp,
  // 'c#': csharp,
  csharp,
  js,
  javascript: js,
  html,
  hs,
  haskell: hs,
  ts,
  typescript: ts,
  python,
  go,
  swift,
  v,
  vlang: v,
  wy,
  wenyan: wy,
  crystal,
  cr : crystal,
  r,
  R: r,
} as {
  [lang: PropertyKey]: ((props?: unknown) => Backend) | Backend
};
