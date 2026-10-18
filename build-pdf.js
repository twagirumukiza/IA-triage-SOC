// Génère pdf/IA-triage-SOC-{fr,en,zh}.pdf à partir de content/*.js (même texte que le site)
const fs=require('fs'),cp=require('child_process');global.C={};
for(const l of['fr','en','zh'])eval(fs.readFileSync('content/'+l+'.js','utf8'));
const M={
fr:{k:'Article conceptuel (cadre de recherche) · 18 octobre 2026',t:'L’intelligence artificielle dans le triage des alertes des SOC',s:'Le rôle modérateur de l’hygiène informatique, du Zero Trust et de la fragmentation des outils',f:'IA et triage des alertes en SOC'},
en:{k:'Conceptual article (research framework) · 18 October 2026',t:'Artificial intelligence in SOC alert triage',s:'The moderating role of cyber hygiene, Zero Trust and tool fragmentation',f:'AI and alert triage in SOCs'},
zh:{k:'概念性文章（研究框架）· 2026年10月18日',t:'人工智能在SOC告警分诊中的应用',s:'IT卫生、零信任与工具碎片化的调节作用',f:'AI与SOC告警分诊'}};
const css=l=>`body{font-family:${l=='zh'?'"Noto Serif CJK SC","Noto Sans CJK SC","WenQuanYi Zen Hei","DejaVu Serif",serif':'"Liberation Serif","Bitstream Charter","DejaVu Serif",serif'};font-size:${l=='zh'?'11':'12'}pt;line-height:1.55;color:#111}
h1{font-size:21pt;margin:0 0 6pt;line-height:1.2}.sub{font-size:13pt;color:#444;margin:0 0 8pt}.k{font-size:9.5pt;color:#555;margin:0 0 4pt}.au{font-size:11pt;margin:0 0 14pt}
h2{font-size:15pt;margin:20pt 0 8pt;border-bottom:1px solid #999;padding-bottom:3pt;page-break-after:avoid}h3{font-size:12pt;margin:14pt 0 5pt;page-break-after:avoid}
p{margin:0 0 7pt;text-align:justify}table{width:100%;border-collapse:collapse;font-size:9.5pt;margin:8pt 0 12pt;page-break-inside:auto}tr{page-break-inside:avoid}
th,td{border:1px solid #bbb;padding:4pt 6pt;text-align:left;vertical-align:top}th{background:#eef2f5}a{color:#0b6b8a;text-decoration:none}
figure{margin:10pt 0;page-break-inside:avoid;text-align:center}figcaption{font-size:9pt;color:#555}svg{width:100%;height:auto}
.sv-box{fill:#fff;stroke:#999;stroke-width:1.5}.sv-main{fill:#0b6b8a;stroke:#0b6b8a}.sv-line{stroke:#555;stroke-width:1.5;fill:none}
.sv-t{fill:#111;font:bold 13.5px sans-serif;text-anchor:middle}.sv-s{fill:#555;font:12.5px sans-serif;text-anchor:middle}.sv-w{fill:#fff;font:bold 15px sans-serif;text-anchor:middle}`;
function blk(b){const t=b.t;
 if(t=='h2')return`<h2>${b.x}</h2>`;if(t=='h3')return`<h3>${b.x}</h3>`;if(t=='p')return`<p>${b.x}</p>`;
 if(t=='ol'||t=='ul')return`<${t}>${b.x.map(i=>`<li>${i}</li>`).join('')}</${t}>`;
 if(t=='table')return`<table><thead><tr>${b.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 if(t=='svg')return`<figure>${b.x.replace(/<path class="sv-line" d="([^"]+)"\/>/g,(m,d)=>d.split(/(?=M)/).map(x=>`<path class="sv-line" d="${x}"/>`).join('')).replace(/var\(--accent\)/g,'#0b6b8a').replace(/var\(--muted\)/g,'#555')}<figcaption>${b.cap}</figcaption></figure>`;return''}
fs.mkdirSync('pdf',{recursive:true});
for(const l of['fr','en','zh']){const m=M[l];
 const h=`<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>${m.t}</title><style>${css(l)}</style></head><body><p class="k">${m.k}</p><h1>${m.t}</h1><p class="sub">${m.s}</p><p class="au">Innocent Twagirumukiza</p>${C[l].map(blk).join('\n')}</body></html>`;
 fs.writeFileSync(`/tmp/${l}.html`,h);
 cp.execSync(`wkhtmltopdf -q --encoding utf-8 --page-size A4 -T 20mm -B 20mm -L 20mm -R 20mm --footer-font-size 8 --footer-center "${m.f}  ·  [page]/[topage]" /tmp/${l}.html pdf/IA-triage-SOC-${l}.pdf`,{stdio:'inherit'});}
