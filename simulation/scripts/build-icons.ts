import { mkdir, writeFile } from 'node:fs/promises';
import { ICON_ART, gameIconSVG } from '../src/ui/GameIcons';

async function main(){
  await mkdir('web/assets/icons',{recursive:true});
  for(const name of Object.keys(ICON_ART)) await writeFile(`web/assets/icons/${name}.svg`,gameIconSVG(name));
  const cards=Object.entries(ICON_ART).map(([name,icon])=>`<article><div class="sizes"><img src="assets/icons/${name}.svg" width="64" height="64"><img src="assets/icons/${name}.svg" width="32" height="32"><img src="assets/icons/${name}.svg" width="20" height="20"></div><b>${icon.label}</b><small>${name}</small></article>`).join('');
  await writeFile('web/icon-gallery.html',`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bộ biểu tượng Thiên Nguyên</title><style>*{box-sizing:border-box}body{margin:0;background:#f4ecd9;color:#4f493b;font:16px Georgia,serif}header{padding:36px max(24px,calc((100vw - 1180px)/2));background:#344e5c;color:#efdfb9;border-bottom:5px solid #bd9b62}h1{margin:0 0 12px;font-size:32px}p{line-height:1.6;margin:0;max-width:780px}main{max-width:1228px;padding:24px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:12px}article{padding:20px;background:#e9dfc6;border:1px solid #b8a785;border-radius:10px;box-shadow:inset 0 0 0 4px #f7efdd}article:nth-child(even){background:#344e5c;color:#f0dcac}.sizes{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px}small{display:block;margin-top:6px;opacity:.7;font:12px monospace}img{object-fit:contain}a{color:#eed5a0}</style><header><h1>Đảo Thiên Nguyên · Bộ biểu tượng riêng</h1><p>${Object.keys(ICON_ART).length} hình vẽ riêng · Viền mực nâu, đất nung, xanh ngọc, vàng rơm.<br>Cùng một nét vẽ cho tài nguyên, cư dân, nghiên cứu và bản đồ. Mỗi mẫu được xem ở 64 / 32 / 20 px, trên nền giấy và nền tối.</p><p><a href="/">Về hòn đảo →</a></p></header><main>${cards}</main></html>`);
  console.log(`Generated ${Object.keys(ICON_ART).length} original illustrated icons and icon-gallery.html.`);
}
void main();
