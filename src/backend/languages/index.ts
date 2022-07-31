import kotlin from './kotlin';
import rust from './rust';
import go from './go';
import js from './js';
import ts from './ts';
import java from './java';
import python from "./python";
import type { Backend} from "..";


export default {
  kotlin,
  rust,
  java,
  js,
  javascript: js,
  ts,
  typescript: ts,
  python
  // go
} as {
  [lang: PropertyKey]: Backend
}
