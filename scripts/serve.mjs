import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.cwd());
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if(pathname.startsWith('/ProbabilityAndStatsMidTerms/')) pathname = pathname.slice('/ProbabilityAndStatsMidTerms'.length);
  const file = path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  const relative = path.relative(root,file);
  if(relative.startsWith('..') || path.isAbsolute(relative) || relative.startsWith('.git') || relative.startsWith('research')) {res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('Stat Lab: http://127.0.0.1:4173/ProbabilityAndStatsMidTerms/'));
