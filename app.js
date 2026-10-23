const S=window.SITE,T=Object.fromEntries(S.topics.map(t=>[t.key,t])),P=S.posts,byId=Object.fromEntries(P.map(p=>[p.id,p]));
const $=s=>document.querySelector(s),app=$('#app'),esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=d=>{const[y,m,dd]=d.split('-');return `${+dd}.${+m}.${y}`};const rt=p=>Math.max(1,Math.round(p.body.split(/\s+/).length/180));
const card=p=>`<a class="pcard fade" href="#/post/${p.id}"><span class="tag">${T[p.topic].icon} ${T[p.topic].name}</span><h4>${esc(p.title)}</h4><div class="ex">${esc(p.body)}</div><div class="meta"><span>${fmt(p.date)}</span>${p.likes?`<span>❤ ${p.likes}</span>`:''}<span>${rt(p)} דק׳ קריאה</span></div></a>`;
function list(arr,n=24){let k=n;const id='l'+Math.random().toString(36).slice(2);setTimeout(()=>{const b=document.getElementById(id+'b');if(b)b.onclick=()=>{k+=24;document.getElementById(id).innerHTML=arr.slice(0,k).map(card).join('');if(k>=arr.length)b.remove()}});
 return arr.length?`<div class="plist" id="${id}">${arr.slice(0,n).map(card).join('')}</div>${arr.length>n?`<button class="btn g more" id="${id}b">עוד פוסטים ↓</button>`:''}`:'<div class="empty">לא נמצא כלום 🙈</div>'}
function home(){const top=[...P].sort((a,b)=>b.likes-a.likes).slice(0,6);
 app.innerHTML=`<section class="hero fade"><h1>קריפטו, כסף, AI <span class="grad">וכל מה שבאמצע</span></h1><p>הבלוג של קוף טירון ב־Web3. מחשבות, הסברים ותובנות מהציוצים של @ApeRookie, מסודרים לפי נושאים, כדי שיהיה כיף לחפור.</p>
 <div class="stats"><span class="pill"><b>${P.length}</b> פוסטים</span><span class="pill"><b>${S.topics.length}</b> נושאים</span><span class="pill">מ־<b>${fmt(P.at(-1).date)}</b> עד <b>${fmt(P[0].date)}</b></span><a class="pill" href="#/post/${P[Math.floor(Math.random()*P.length)].id}">🎲 <b>פוסט אקראי</b></a></div></section>
 <h2 class="sec">🗂️ נושאים</h2><div class="grid">${S.topics.map(t=>`<a class="tcard fade" href="#/topic/${t.key}"><span class="n">${t.count}</span><div class="ic">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p></a>`).join('')}</div>
 <h2 class="sec">🔥 הכי אהובים</h2>${list(top,6)}<h2 class="sec">🆕 אחרונים</h2>${list(P,12)}`}
function topic(k){const t=T[k];if(!t)return home();let sort='new';const draw=()=>{const arr=P.filter(p=>p.topic==k).sort((a,b)=>sort=='top'?b.likes-a.likes:b.date.localeCompare(a.date));$('#tl').innerHTML=list(arr)};
 app.innerHTML=`<div class="crumb fade"><a href="#/">בית</a> / ${t.name}</div><div class="thead fade"><span class="ic">${t.icon}</span><div><h1>${t.name}</h1><div class="crumb">${t.desc} · ${t.count} פוסטים</div></div></div>
 <div class="stats"><button class="pill on" data-s="new">חדשים קודם</button><button class="pill" data-s="top">הכי אהובים</button></div><div id="tl"></div>`;
 app.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sort=b.dataset.s;app.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',x==b));draw()});draw()}
function post(id){const p=byId[id];if(!p)return home();const t=T[p.topic],sib=P.filter(x=>x.topic==p.topic),i=sib.indexOf(p),prev=sib[i+1],next=sib[i-1];
 const rel=sib.filter(x=>x!==p).sort((a,b)=>b.likes-a.likes).slice(0,4);
 app.innerHTML=`<article class="post fade"><div class="crumb"><a href="#/">בית</a> / <a href="#/topic/${t.key}">${t.icon} ${t.name}</a></div><h1>${esc(p.title)}</h1>
 <div class="meta"><span>${fmt(p.date)}</span>${p.likes?`<span>❤ ${p.likes} לייקים</span>`:''}${p.views?`<span>👁 ${p.views.toLocaleString()} צפיות</span>`:''}<span>${rt(p)} דק׳ קריאה</span></div>
 <div class="body">${esc(p.body)}</div>${p.links.length?`<div class="links"><b>קישורים:</b>${p.links.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join('')}</div>`:''}
 <p><a class="btn" href="${p.url}" target="_blank" rel="noopener">לציוץ המקורי ב־X ↗</a></p>
 <div class="nav">${prev?`<a class="btn g" href="#/post/${prev.id}">→ הקודם</a>`:'<span></span>'}${next?`<a class="btn g" href="#/post/${next.id}">הבא ←</a>`:''}</div></article>
 <h2 class="sec">עוד ב${t.name}</h2>${list(rel,4)}`}
function search(q){const w=q.toLowerCase().split(/\s+/).filter(Boolean);const arr=P.filter(p=>w.every(x=>(p.body+' '+T[p.topic].name).toLowerCase().includes(x)));
 app.innerHTML=`<h2 class="sec fade">🔎 ${arr.length} תוצאות עבור "${esc(q)}"</h2><div class="stats">${S.topics.map(t=>`<a class="pill" href="#/topic/${t.key}">${t.icon} ${t.name}</a>`).join('')}</div>${list(arr)}`}
function route(){const h=location.hash.slice(2).split('/');window.scrollTo(0,0);
 if(h[0]=='topic')topic(h[1]);else if(h[0]=='post')post(h[1]);else if(h[0]=='search')search(decodeURIComponent(h[1]||''));else home()}
let tm;$('#q').oninput=e=>{clearTimeout(tm);tm=setTimeout(()=>{const v=e.target.value.trim();location.hash=v?'#/search/'+encodeURIComponent(v):'#/'},250)};
$('#theme').onclick=()=>{document.body.classList.toggle('light');localStorage.theme=document.body.classList.contains('light')?'light':'dark'};
if(localStorage.theme=='light')document.body.classList.add('light');addEventListener('hashchange',route);route();
