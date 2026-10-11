import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import katex from '../assets/vendor/katex/katex.mjs';
import { equationHTML, workingHTML } from '../math-render.mjs';

const baselines = {
  'questions-w12':'2dc8facb5dcd856884d01b6ade24ad122c6fcaba648b9afea874465f65d9f1c8',
  'methods-w12':'94facc42c04ba3e4bfbe62a6a534931cb2850b13f71301fd22f1aad840adf99b',
  'questions-w3':'35930a1b277ef992fda737aa7e12113cca91989abb9abd756acc552af6a4fe64',
  'methods-w3':'8ecc47afec6bc6f808ec57ba0c37a7198ef40be393f66324d8a28ffec3bc918b',
  'questions-w45':'8df0952e2094c95f7c6c2edd3c0b69ccb819ccaa1b0caeb06faa06e5bb807c61',
  'methods-w45':'c1fe34acff03ffc74bad12b22a068ce2f42e5b6c4e779c92d1335cbb4aea15e2',
};
const presentationKeys = new Set(['mathTex','optionsTex','promptParts']);
function originalContent(value) {
  if (Array.isArray(value)) return value.map(originalContent);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key])=>!presentationKeys.has(key)).map(([key,v])=>[key,originalContent(v)]));
  return value;
}
let count=0, workings=0, choices=0;
function parse(tex, context) {
  assert.equal(typeof tex,'string',`Missing LaTeX for ${context}`);
  assert.ok(tex.trim(),`Empty LaTeX for ${context}`);
  assert.ok(!/(^|[^\\a-zA-Z])(text|int|frac|sum|sqrt|binom|mathbb|operatorname|mathrm)(?=[{_^])/.test(tex),`Lost LaTeX command backslash in ${context}`);
  try { katex.renderToString(tex,{throwOnError:true,trust:false,strict:'ignore'}); }
  catch(error){ throw new Error(`${context}: ${error.message}`); }
  count++;
}
for(const [name,expectedHash] of Object.entries(baselines)) {
  const data=JSON.parse(fs.readFileSync(`data/${name}.json`,'utf8'));
  const actualHash=createHash('sha256').update(JSON.stringify(originalContent(data))).digest('hex');
  assert.equal(actualHash,expectedHash,`${name}: original questions, workings, or answers changed during presentation formatting`);
  for(const item of data) {
    for(const [index,step] of (item.steps||item.recipe).entries()) {
      if(step.math||step.formula){parse(step.mathTex,`${item.id} step ${index+1}`);workings++;}
    }
    if(item.optionsTex) {
      assert.equal(item.optionsTex.length,item.options.length,`Mismatched options: ${item.id}`);
      for(const [i,tex] of item.optionsTex.entries())if(tex!==null){parse(tex,`${item.id} option ${i+1}`);choices++;}
    }
    for(const part of item.promptParts||[]) {
      assert.ok(typeof part.text==='string'||typeof part.tex==='string',`Invalid prompt part: ${item.id}`);
      if(part.tex)parse(part.tex,`${item.id} question formula`);
    }
  }
}
const fraction=equationHTML('\\frac{3}{8}','3/8',false);
assert.ok(fraction.includes('mfrac'),'Fractions must have accessible MathML');
assert.ok(fraction.includes('katex-html'),'Equations must render visually');
assert.ok(workingHTML('x^2','x²').includes('tabindex="0"'),'Long equations must be keyboard-scrollable');
assert.ok(equationHTML('\\frac{','<script>',false).includes('&lt;script&gt;'),'Fallback text must be escaped');
for(const match of fs.readFileSync('assets/vendor/katex/katex.min.css','utf8').matchAll(/url\((fonts\/[^)]+)\)/g)) {
  assert.ok(fs.existsSync('assets/vendor/katex/'+match[1]),`Missing bundled equation font: ${match[1]}`);
}
console.log(`Validated ${count} LaTeX expressions (${workings} workings/recipe formulas, ${choices} answer choices).`);
console.log('Original question text, values, answers, references, and saved-note IDs are preserved.');
