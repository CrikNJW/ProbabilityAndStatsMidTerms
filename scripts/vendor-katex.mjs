import { mkdir, copyFile, cp } from 'node:fs/promises';
import path from 'node:path';
const source = path.resolve('node_modules/katex');
const target = path.resolve('assets/vendor/katex');
await mkdir(target, { recursive: true });
for (const file of ['dist/katex.mjs', 'dist/katex.min.css', 'LICENSE']) {
  await copyFile(path.join(source, file), path.join(target, path.basename(file)));
}
await cp(path.join(source, 'dist/fonts'), path.join(target, 'fonts'), { recursive: true });
console.log('Copied KaTeX and its fonts into the static site.');
