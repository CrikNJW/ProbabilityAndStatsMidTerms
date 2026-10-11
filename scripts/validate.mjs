import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json','utf8'));
const questions=['questions-w12','questions-w3','questions-w45'].flatMap(read);
const methods=['methods-w12','methods-w3','methods-w45'].flatMap(read);
const materials=read('materials');
const questionIds=new Set(), methodIds=new Set(methods.map(m=>m.id));
assert.equal(methodIds.size,methods.length,'Duplicate method IDs');
function refsValid(refs,context){assert.ok(refs?.length,`No references: ${context}`);for(const r of refs){assert.ok(materials[r.doc],`Unknown document ${r.doc}: ${context}`);assert.ok(Number.isInteger(r.page)&&r.page>=1&&r.page<=materials[r.doc].pages,`Invalid page: ${context}`);assert.ok(fs.existsSync(materials[r.doc].imageBase+r.page+'.webp'),`Missing slide image: ${context}`);}}
for(const q of questions){assert.ok(!questionIds.has(q.id),`Duplicate ID ${q.id}`);questionIds.add(q.id);assert.ok([1,2,3,4,5].includes(q.week),`Invalid week ${q.id}`);assert.ok(q.prompt?.length>20,`Incomplete prompt ${q.id}`);assert.ok(q.options?.length>=3,`Missing answer options ${q.id}`);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,`Invalid answer ${q.id}`);assert.ok(methodIds.has(q.method),`Unknown method ${q.method} in ${q.id}`);assert.ok(q.recognize?.length>=1,`No method clues ${q.id}`);assert.ok(q.steps?.length>=3,`Too few steps ${q.id}`);for(const step of q.steps){assert.ok(step.title&&step.why,`Missing reasoning ${q.id}`);if(step.refs?.length)refsValid(step.refs,q.id);}refsValid(q.refs,q.id);assert.ok(q.source.title&&q.source.page&&q.source.question,`Missing source ${q.id}`);assert.ok(['Lecture','Homework','Tutorial','Quiz'].includes(q.source.kind),`Unknown source kind ${q.id}`);assert.ok(['Foundation','Standard','Stretch'].includes(q.difficulty),`Invalid difficulty ${q.id}`);assert.ok(!/moment.generating|\bMGF\b/i.test(q.title+' '+q.prompt),`MGF question in exam scope ${q.id}`);assert.ok(q.answerText,`Missing answer explanation ${q.id}`);assert.ok(q.pitfalls?.length,`Missing trap ${q.id}`);}
for(const m of methods){assert.ok(m.recipe?.length>=3,`Incomplete reusable recipe ${m.id}`);assert.ok(m.recognize?.length&&m.description,`Incomplete method ${m.id}`);refsValid(m.refs,m.id);}
for(let week=1;week<=5;week++){const qs=questions.filter(q=>q.week===week);for(const kind of ['Lecture','Homework','Tutorial'])assert.ok(qs.some(q=>q.source.kind===kind),`Missing Week ${week} ${kind} coverage`);}
assert.ok(!materials.tutorial1,'Private handwritten source must not be published');
assert.ok(!materials.week6,'Week6 must be omitted');
const content=JSON.stringify(questions);
assert.ok(!/Grade\s+\d|Started\s+(Monday|Tuesday|Wednesday|Thursday|Friday)|ng\.jingwen/i.test(content),'Private attempt metadata found');
const imageCount=Object.values(materials).reduce((n,m)=>n+m.pages,0);
console.log(`Validated ${questions.length} questions, ${methods.length} reusable methods, and ${imageCount} source pages.`);
for(let w=1;w<=5;w++)console.log(`Week ${w}: ${questions.filter(q=>q.week===w).length} questions`);
