// Serve the checkout on a temporary loopback port and run the browser suites
// against that exact tree. No global server, production save or CDN required.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const preview=process.argv[2]==='--preview';
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.mjs':'text/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.wav':'audio/wav','.mp3':'audio/mpeg','.ogg':'audio/ogg','.m4a':'audio/mp4'};
const server=http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    const relative=path.relative(root,file).split(path.sep).join('/');
    if(!(relative==='index.html'||relative.startsWith('public/')||['docs/first-commission-fit.png','docs/first-commission-fit.html'].includes(relative))){res.writeHead(403).end();return;}
    const body=await fs.readFile(file); res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(body);
  } catch {if(!res.headersSent)res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(preview?4176:0,'127.0.0.1',resolve));
if(preview){console.log('First commission: http://127.0.0.1:4176/?playtest=first-commission');}
else try {
  for(const suite of (process.argv.length>2?process.argv.slice(2):['first-commission-playtest'])){
    if(!/^[a-z0-9-]+$/.test(suite))throw Error('Invalid suite name');
    const child=spawn(process.execPath,[path.join(root,'tests',suite+'.mjs')],{cwd:root,stdio:'inherit',env:{...process.env,BRASSREACH_URL:'http://127.0.0.1:'+server.address().port+'/'}});
    const status=await new Promise((resolve,reject)=>{child.on('exit',resolve);child.on('error',reject);});
    if(status!==0){process.exitCode=1;break;}
  }
} finally {server.close();}
