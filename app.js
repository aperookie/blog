const S=window.SITE,T=Object.fromEntries(S.topics.map(t=>[t.key,t])),P=S.posts,byId=Object.fromEntries(P.map(p=>[p.id,p]));
const $=s=>document.querySelector(s),app=$('#app'),esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=d=>{const[y,m,dd]=d.split('-');return `${+dd}.${+m}.${y}`};const rt=p=>Math.max(1,Math.round(p.body.split(/\s+/).length/180));
const card=p=>`<a class="pcard fade${RD().includes(p.id)?' seen':''}" href="#/topic/${p.topic}/${p.id}"><span class="tag">${T[p.topic].icon} ${T[p.topic].name}</span><h4>${esc(p.title)}</h4><div class="ex">${esc(p.body)}</div><div class="meta"><span>${fmt(p.date)}</span>${p.likes?`<span>❤ ${p.likes}</span>`:''}<span>${rt(p)} דק׳ קריאה</span></div></a>`;
const RD=()=>JSON.parse(localStorage.read||'[]');const markRead=id=>{const r=RD();if(!r.includes(id)){r.push(id);localStorage.read=JSON.stringify(r)}};
const today=new Date().toISOString().slice(0,10);const dayIdx=[...today].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7)%P.length;
const potd=[...P].sort((a,b)=>b.likes-a.likes).slice(0,80)[dayIdx%80];
const rnd=()=>P[Math.floor(Math.random()*P.length)].id;
const counter=()=>{const n=RD().length;return `<span class="pill">📚 קראת <b>${n}</b> מתוך ${P.length}</span>`};
const chips=cur=>`<div class="chips">${S.topics.map(t=>`<a class="chip${t.key==cur?' on':''}" href="#/topic/${t.key}">${t.icon} ${t.name}</a>`).join('')}</div>`;
const share=p=>{const u=location.origin+location.pathname+'#/post/'+p.id;return `<div class="share"><button class="btn g" onclick="navigator.clipboard.writeText('${u}').then(()=>{this.textContent='✓ הועתק'})">🔗 העתקת קישור</button><a class="btn g" target="_blank" rel="noopener" href="https://x.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(p.title.slice(0,100))}">𝕏 שיתוף</a></div>`};
function list(arr,n=24){let k=n;const id='l'+Math.random().toString(36).slice(2);setTimeout(()=>{const b=document.getElementById(id+'b');if(b)b.onclick=()=>{k+=24;document.getElementById(id).innerHTML=arr.slice(0,k).map(card).join('');if(k>=arr.length)b.remove()};if(b&&'IntersectionObserver' in window){const io=new IntersectionObserver(e=>{if(e[0].isIntersecting&&b.isConnected)b.click()},{rootMargin:'400px'});io.observe(b)}});
 return arr.length?`<div class="plist" id="${id}">${arr.slice(0,n).map(card).join('')}</div>${arr.length>n?`<button class="btn g more" id="${id}b">עוד פוסטים ↓</button>`:''}`:'<div class="empty">לא נמצא כלום 🙈</div>'}
function home(){const top=[...P].sort((a,b)=>b.likes-a.likes).slice(0,6);
 const kf=n=>n>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,'')+'M':n>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,'')+'K':''+n;
 const hot=[...P].sort((a,b)=>(b.views||0)-(a.views||0)||b.likes-a.likes).slice(0,6);
 app.innerHTML=`<section class="hot fade"><h2>🔥 הציוצים הפופולריים ביותר</h2><div class="hotg">${hot.map((p,i)=>`<a class="hotc" href="#/topic/${p.topic}/${p.id}"><span class="rank">#${i+1}</span><div class="views">${p.views?kf(p.views):kf(p.likes)}<small>${p.views?' צפיות':' לייקים'}</small></div><div class="hl2">❤ ${p.likes} · ${T[p.topic].icon} ${T[p.topic].name}</div>${p.shot?`<img class="hshot" src="${p.shot}" loading="lazy" alt="${esc('ציוץ של @ApeRookie: '+p.body)}">`:`<p>${esc(p.body.slice(0,110))}${p.body.length>110?'…':''}</p>`}</a>`).join('')}</div></section><section class="hero fade"><h1>קריפטו, כסף, AI <span class="grad">וכל מה שבאמצע</span></h1><p>הבלוג של קוף טירון ב־Web3. מחשבות, הסברים ותובנות מהציוצים של @ApeRookie, מסודרים לפי נושאים, כדי שיהיה כיף לחפור.</p>
 <div class="stats"><span class="pill"><b>${P.length}</b> פוסטים</span><span class="pill"><b>${S.topics.length}</b> נושאים</span><span class="pill">מ־<b>${fmt(P.at(-1).date)}</b> עד <b>${fmt(P[0].date)}</b></span>${counter()}</div><div class="cta"><a class="btn big" href="#/post/${rnd()}">🎲 תפתיע אותי</a><a class="btn g big" href="#/post/${potd.id}">☀️ פוסט היום</a></div></section>
 <a class="potd fade" href="#/post/${potd.id}"><span class="tag">☀️ פוסט היום · ${T[potd.topic].icon} ${T[potd.topic].name}</span><h3>${esc(potd.title)}</h3><p>${esc(potd.body.slice(0,180))}…</p><b>להמשך קריאה ←</b></a>
 <h2 class="sec">🗂️ נושאים</h2><div class="grid">${S.topics.map(t=>`<a class="tcard fade" href="#/topic/${t.key}"><span class="n">${t.count}</span><div class="ic">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p></a>`).join('')}</div>
 <h2 class="sec">🔥 הכי אהובים</h2>${list(top,6)}<h2 class="sec">📅 הכי אהובים החודש</h2>${list(P.filter(p=>p.date>=P[0].date.slice(0,8)+'01'||p.date>=new Date(Date.parse(P[0].date)-30*864e5).toISOString().slice(0,10)).sort((a,b)=>b.likes-a.likes).slice(0,6),6)}<h2 class="sec">🆕 אחרונים</h2>${list(P,12)}`}
function topic(k){const t=T[k];if(!t)return home();let sort='new';const draw=()=>{const arr=P.filter(p=>p.topic==k).sort((a,b)=>sort=='top'?b.likes-a.likes:b.date.localeCompare(a.date));$('#tl').innerHTML=list(arr)};
 app.innerHTML=`<div class="crumb fade"><a href="#/">בית</a> / ${t.name}</div><div class="thead fade"><span class="ic">${t.icon}</span><div><h1>${t.name}</h1><div class="crumb">${t.desc} · ${t.count} פוסטים</div></div></div>
 <div class="stats"><button class="pill on" data-s="new">חדשים קודם</button><button class="pill" data-s="top">הכי אהובים</button></div>${chips(k)}<div id="tl"></div>`;
 app.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sort=b.dataset.s;app.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',x==b));draw()});draw()}
function post(id){const p=byId[id];if(!p)return home();markRead(id);const t=T[p.topic],sib=P.filter(x=>x.topic==p.topic),i=sib.indexOf(p),prev=sib[i+1],next=sib[i-1];
 const r=RD();const rel=sib.filter(x=>x!==p&&!r.includes(x.id)).sort((a,b)=>b.likes-a.likes).slice(0,4);
 const pop=[...P].filter(x=>x.topic!=p.topic&&!r.includes(x.id)).sort((a,b)=>b.likes-a.likes).slice(0,4);navPrev=prev;navNext=next;
 app.innerHTML=`<article class="post fade"><div class="crumb"><a href="#/">בית</a> / <a href="#/topic/${t.key}">${t.icon} ${t.name}</a></div><h1>${esc(p.title)}</h1>
 <div class="meta"><span>${fmt(p.date)}</span>${p.likes?`<span>❤ ${p.likes} לייקים</span>`:''}${p.views?`<span>👁 ${p.views.toLocaleString()} צפיות</span>`:''}<span>${rt(p)} דק׳ קריאה</span></div>
 ${p.shot?`<figure class="shot"><img src="${p.shot}" alt="${esc('ציוץ של @ApeRookie: '+p.body)}" loading="eager" width="548"><figcaption class="sr">${esc(p.body)}</figcaption></figure>`:`<div class="body">${esc(p.body)}</div>`}${p.links.length?`<div class="links"><b>קישורים:</b>${p.links.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join('')}</div>`:''}
 <p><a class="btn" href="${p.url}" target="_blank" rel="noopener">לציוץ המקורי ב־X ↗</a></p>
 ${share(p)}<div class="nav">${prev?`<a class="btn g" href="#/post/${prev.id}">→ הקודם</a>`:'<span></span>'}${next?`<a class="btn g" href="#/post/${next.id}">הבא ←</a>`:''}</div></article>
 <h2 class="sec">📖 הבא בתור ב${t.name}</h2>${list(rel,4)}<h2 class="sec">🔥 פופולרי בנושאים אחרים</h2>${list(pop,4)}${chips(p.topic)}<div class="cta"><a class="btn big" href="#/post/${rnd()}">🎲 עוד פוסט אקראי</a></div><p class="hint">טיפ: ← → במקלדת או החלקה למעבר בין פוסטים</p>`}
let navPrev,navNext;const go=p=>{if(p&&location.hash.startsWith('#/post/'))location.hash='#/post/'+p.id};
addEventListener('keydown',e=>{if(e.target.tagName=='INPUT')return;if(e.key=='ArrowLeft')go(navNext);if(e.key=='ArrowRight')go(navPrev)});
let tx,ty;addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>80&&Math.abs(dy)<50)go(dx>0?navNext:navPrev)},{passive:true});
const bar=document.createElement('div');bar.id='prog';document.body.prepend(bar);
addEventListener('scroll',()=>{const h=document.documentElement;bar.style.width=(location.hash.startsWith('#/topic/')?100*h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight):0)+'%'},{passive:true});
function search(q){const w=q.toLowerCase().split(/\s+/).filter(Boolean);const arr=P.filter(p=>w.every(x=>(p.body+' '+T[p.topic].name).toLowerCase().includes(x)));
 app.innerHTML=`<h2 class="sec fade">🔎 ${arr.length} תוצאות עבור "${esc(q)}"</h2><div class="stats">${S.topics.map(t=>`<a class="pill" href="#/topic/${t.key}">${t.icon} ${t.name}</a>`).join('')}</div>${list(arr)}`}
function route(){navPrev=navNext=null;bar.style.width='0';const h=location.hash.slice(2).split('/');window.scrollTo(0,0);
 if(h[0]=='topic')topic(h[1],h[2]);else if(h[0]=='post')post(h[1]);else if(h[0]=='search')search(decodeURIComponent(h[1]||''));else home()}
let tm;$('#q').oninput=e=>{clearTimeout(tm);tm=setTimeout(()=>{const v=e.target.value.trim();location.hash=v?'#/search/'+encodeURIComponent(v):'#/'},250)};
$('#theme').onclick=()=>{document.body.classList.toggle('light');localStorage.theme=document.body.classList.contains('light')?'light':'dark'};
if(localStorage.theme=='light')document.body.classList.add('light');

// ===== Category infinite feed (overrides topic/post views) =====
const item=(p,i,n)=>{const u=location.origin+location.pathname+'#/topic/'+p.topic+'/'+p.id;return `<article class="fitem${RD().includes(p.id)?' seen':''}" id="p${p.id}" data-id="${p.id}" data-i="${i+1}">
 <div class="meta"><span class="num">${i+1}/${n}</span><span>${fmt(p.date)}</span>${p.likes?`<span>❤ ${p.likes}</span>`:''}${p.views?`<span>👁 ${p.views.toLocaleString()}</span>`:''}</div>
 ${p.shot?`<figure class="shot"><img src="${p.shot}" loading="lazy" decoding="async" alt="${esc('ציוץ של @ApeRookie: '+p.body)}"><figcaption class="sr">${esc(p.body)}</figcaption></figure>`:`<div class="body">${esc(p.body)}</div>`}
 ${p.links.length?`<div class="links">${p.links.map(x=>`<a href="${esc(x)}" target="_blank" rel="noopener">${esc(x)}</a>`).join('')}</div>`:''}
 <div class="share"><a class="btn g sm" href="${p.url}" target="_blank" rel="noopener">לציוץ ב־X ↗</a><button class="btn g sm" data-copy="${u}">🔗 העתקה</button><a class="btn g sm" target="_blank" rel="noopener" href="https://x.com/intent/tweet?url=${encodeURIComponent(u)}">𝕏 שיתוף</a></div></article>`};
let feedIO,readIO;
function topic(k,target,sort){const t=T[k];if(!t)return home();sort=sort||'new';feedIO&&feedIO.disconnect();readIO&&readIO.disconnect();
 const arr=P.filter(p=>p.topic==k).sort((a,b)=>sort=='top'?b.likes-a.likes:b.date.localeCompare(a.date)),n=arr.length;let shown=0;
 app.innerHTML=`<div class="crumb fade"><a href="#/">בית</a> / ${t.name}</div><div class="thead fade"><span class="ic">${t.icon}</span><div><h1>${t.name}</h1><div class="crumb">${t.desc} · ${n} ציוצים</div></div></div>
 <div class="stats"><button class="pill${sort=='new'?' on':''}" data-s="new">חדשים קודם</button><button class="pill${sort=='top'?' on':''}" data-s="top">הכי אהובים</button><a class="pill" href="#/topic/${k}/${arr[Math.floor(Math.random()*n)].id}">🎲 אקראי</a>${counter()}</div>${chips(k)}
 <div id="feed"></div><div id="sent"></div><div class="fprog" id="fprog">0 מתוך ${n}</div>`;
 app.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{topic(k,null,b.dataset.s);scrollTo(0,0)});
 const feed=$('#feed'),fp=$('#fprog');let maxi=0;
 readIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;markRead(el.dataset.id);el.classList.add('seen');maxi=Math.max(maxi,+el.dataset.i);fp.textContent=`${maxi} מתוך ${n}`;fp.classList.add('on')}}),{threshold:.5});
 const more=c=>{const s=arr.slice(shown,shown+c);feed.insertAdjacentHTML('beforeend',s.map((p,j)=>item(p,shown+j,n)).join(''));
  [...feed.children].slice(shown).forEach(el=>readIO.observe(el));shown+=s.length;
  if(shown>=n){feedIO.disconnect();$('#sent').outerHTML=`<section class="endcat fade" id="endcat"><div class="big">🎉</div><h2>סיימת את כל ${n} הציוצים ב${t.name}!</h2><p>רוצה להמשיך? בחר נושא הבא:</p><div class="grid">${S.topics.filter(x=>x.key!=k).map(x=>`<a class="tcard" href="#/topic/${x.key}"><span class="n">${x.count}</span><div class="ic">${x.icon}</div><h3>${x.name}</h3></a>`).join('')}</div><div class="cta"><a class="btn big" href="#/topic/${S.topics[(S.topics.findIndex(x=>x.key==k)+1)%S.topics.length].key}">לנושא הבא ←</a><a class="btn g big" href="#/">🏠 לדף הבית</a></div></section>`;new IntersectionObserver(e=>{if(e[0].isIntersecting){fp.textContent=`✓ ${n} מתוך ${n}`;arr.forEach(p=>markRead(p.id))}}).observe($('#endcat'))}};
 feedIO=new IntersectionObserver(e=>{if(e[0].isIntersecting)more(12)},{rootMargin:'1200px'});
 const ti=target?arr.findIndex(p=>p.id==target):-1;more(Math.max(12,ti+3));feedIO.observe($('#sent')||document.body);
 if(ti>=0)requestAnimationFrame(()=>{const el=document.getElementById('p'+target);el.scrollIntoView({block:'start'});scrollBy(0,-70);el.classList.add('hl')})}
function post(id){const p=byId[id];if(!p)return home();location.replace('#/topic/'+p.topic+'/'+id)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b)navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy).then(()=>b.textContent='✓ הועתק')});

addEventListener('hashchange',route);route();
