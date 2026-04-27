const fs=require("fs"),path=require("path"),sharp=require("sharp");

// ╔══════════════════════════════════════════════════════════════════╗
// ║                                                                ║
// ║   ⚡⚡⚡  THESE 2 MUST MATCH build-site.js  ⚡⚡⚡              ║
// ║                                                                ║
// ║   Copy the EXACT same domain and phone from build-site.js      ║
// ║                                                                ║
// ╚══════════════════════════════════════════════════════════════════╝

const SITE  = "https://alexsverdlik.com";  // Same as build-site.js #1
const PHONE = "(626) 644-3476";            // Same as build-site.js #2

// -------- STOP HERE — don't change anything below --------
const OUT   = path.join(__dirname, "dist");
const Y=new Date().getFullYear();

// ===== CLEAN BUILD =====
// Wipe dist/blog/ at the start of every build so unpublished posts'
// stale <slug>.html files don't persist on the live site.
// (Netlify deploys are file-additive — without this, removed posts
// linger as orphaned static assets. Filed Session 3h, fixed Session 3i.)
fs.rmSync(`${OUT}/blog`, {recursive: true, force: true});
fs.mkdirSync(`${OUT}/blog`, {recursive: true});

// ===== IMPORT DASHBOARD POSTS =====
// Drop the exported JSON from the dashboard into the same folder as this script.
// Name it: blog-approved-YYYY-MM-DD.json (or any .json file starting with "blog-approved")
// The script will find the newest one automatically.
const IMPORT_DIR=path.join(__dirname,"data");
const importFiles=fs.existsSync(IMPORT_DIR)?fs.readdirSync(IMPORT_DIR).filter(f=>f.startsWith("blog-approved")&&f.endsWith(".json")).sort().reverse():[];
let dashboardPosts=[];
if(importFiles.length>0){
  try{
    const raw=JSON.parse(fs.readFileSync(path.join(IMPORT_DIR,importFiles[0]),"utf8"));
    dashboardPosts=Array.isArray(raw)?raw:[];
    console.log(`📥 Imported ${dashboardPosts.length} posts from ${importFiles[0]}`);
  }catch(e){console.log("⚠ Could not read dashboard export:",e.message);}
}

// ===== IMAGE EXTRACTION =====
// Converts base64 data URIs in post HTML to proper image files.
// Resizes down to 960px max edge and re-encodes JPEG with mozjpeg at quality 78.
// /blog/images/[slug]-1.jpg, /blog/images/[slug]-2.jpg, etc.
// Returns { html, tasks } — tasks is an array of pending sharp promises.
function extractImages(html,slug){
  const imgDir=`${OUT}/blog/images`;
  fs.mkdirSync(imgDir,{recursive:true});
  const tasks=[];
  let count=0;
  const newHtml=html.replace(/(<img[^>]*)\ssrc="data:image\/(jpeg|png|webp);base64,([^"]+)"([^>]*>)/gi,(match,pre,fmt,b64,post)=>{
    count++;
    const filename=`${slug}-${count}.jpg`;
    const filepath=`${imgDir}/${filename}`;
    tasks.push((async()=>{
      await sharp(Buffer.from(b64,"base64"))
        .rotate() // honor EXIF orientation
        .resize({width:960,height:960,fit:"inside",withoutEnlargement:true})
        .jpeg({quality:78,mozjpeg:true})
        .toFile(filepath);
      const kb=Math.round(fs.statSync(filepath).size/1024);
      console.log(`  📷 ${filename} (${kb}KB)`);
    })());
    return `${pre} src="/blog/images/${filename}" loading="lazy" decoding="async"${post}`;
  });
  return{html:newHtml,tasks};
}

const CSS=fs.readFileSync(`${OUT}/index.html`,"utf8").match(/<style>([\s\S]*?)<\/style>/)?.[1]||"";

// Add blog-specific CSS
const BCSS=`
.breadcrumbs{padding:8px 0;font-size:13px;color:var(--wgray,#9a9ab0)}
.breadcrumbs a{color:var(--gold,#c9a96e)}
.breadcrumbs span{margin:0 8px;opacity:.4}
.blog-body{max-width:780px}
.blog-body p{margin-bottom:18px}
.blog-body h2{margin-top:40px;margin-bottom:16px;font-size:clamp(22px,3vw,30px);font-family:var(--fd,'Playfair Display',serif)}
.blog-body h3{margin-top:32px;margin-bottom:12px}
.blog-body a{color:var(--gold,#c9a96e);font-weight:500;border-bottom:1px solid rgba(201,169,110,.3)}
.blog-meta{font-size:13px;color:var(--slate,#6b7394);margin:12px 0 32px;display:flex;gap:16px;flex-wrap:wrap}
.blog-tag{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold,#c9a96e);background:rgba(201,169,110,.08);padding:3px 8px;border-radius:2px}
.blog-card{border-bottom:1px solid rgba(45,49,66,.07);padding:32px 0}
.blog-card:first-child{padding-top:0}
.blog-card h3 a{color:var(--navy,#1a1f2e);transition:color .3s}
.blog-card h3 a:hover{color:var(--gold,#c9a96e)}
.related-posts{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:24px}
.related-card{padding:20px;background:var(--white,#fff);border:1px solid rgba(45,49,66,.07);border-radius:5px;transition:all .3s;display:block}
.related-card:hover{border-color:var(--gold,#c9a96e);transform:translateY(-2px)}
.related-card h4{font-family:var(--fd);font-size:16px;color:var(--navy,#1a1f2e);margin-bottom:6px}
.related-card p{font-size:13px;color:var(--slate,#6b7394)}
.faq-item{border-bottom:1px solid rgba(45,49,66,.07);padding:20px 0}
.faq-q{font-family:var(--fd,'Playfair Display',serif);font-size:18px;font-weight:600;color:var(--navy,#1a1f2e);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px}
.faq-a{padding:12px 0 0;display:none}
.faq-a.open{display:block}
.faq-q .arrow{color:var(--gold,#c9a96e);font-size:20px;flex-shrink:0}
`;

// Extract nav and footer from existing page
const idx=fs.readFileSync(`${OUT}/index.html`,"utf8");
const navHTML=idx.match(/<nav[\s\S]*?<\/nav>/)?.[0]||"";
const footHTML=idx.match(/<footer[\s\S]*?<\/footer>/)?.[0]||"";
const scriptHTML=idx.match(/<script>[\s\S]*?<\/script>/)?.[0]||"";

// Blog link is now present in main nav via build-site.js, so reuse navHTML directly.
const navWithBlog=navHTML;

function blogPage(title,desc,slug,body,schemas=""){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Alex Sverdlik</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/blog/${slug}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/blog/${slug}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Alex Sverdlik Real Estate">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${title.replace(/"/g,'\\"')}","author":{"@type":"Person","name":"Alex Sverdlik"},"publisher":{"@type":"Organization","name":"Alex Sverdlik Real Estate"},"url":"${SITE}/blog/${slug}"}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${SITE}/"},{"@type":"ListItem","position":2,"name":"Blog","item":"${SITE}/blog"},{"@type":"ListItem","position":3,"name":"${title.split(':')[0].replace(/"/g,'\\"')}"}]}</script>
${schemas}
<style>${CSS}${BCSS}</style>
</head>
<body>
${navWithBlog}
<section class="section section-light" style="padding-top:140px">
<div class="container">
<div class="breadcrumbs"><a href="/">Home</a><span>›</span><a href="/blog">Blog</a><span>›</span>${title.split(':')[0]}</div>
<article class="blog-body" id="blogArticle" style="margin-top:24px">
${body}
</article>
<div style="margin-top:24px" id="langPanel">
<style>.lang-btn{display:inline-block;font-size:13px;padding:6px 14px;margin:3px;border-radius:20px;border:1px solid rgba(201,169,110,0.3);background:transparent;color:var(--gold,#c9a96e);cursor:pointer;font-family:inherit;transition:all .2s}.lang-btn:hover,.lang-btn.active{background:rgba(201,169,110,0.1);border-color:var(--gold,#c9a96e)}.lang-toggle{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--gold,#c9a96e);cursor:pointer;border:none;background:none;font-family:inherit;padding:0;opacity:.7;transition:opacity .2s}.lang-toggle:hover{opacity:1}.lang-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(201,169,110,0.3);border-top-color:var(--gold,#c9a96e);border-radius:50%;animation:lspin .8s linear infinite}@keyframes lspin{to{transform:rotate(360deg)}}</style>
<button class="lang-toggle" onclick="document.getElementById('langOpts').style.display=document.getElementById('langOpts').style.display==='none'?'block':'none'">🌐 <span>Read in another language</span></button>
<div id="langOpts" style="display:none;margin-top:10px">
<button class="lang-btn" onclick="translateTo('Russian','ru')">Русский</button>
<button class="lang-btn" onclick="translateTo('Spanish','es')">Español</button>
<button class="lang-btn" onclick="translateTo('Hebrew','he')">עברית</button>
<button class="lang-btn" onclick="translateTo('Portuguese','pt')">Português</button>
<button class="lang-btn" onclick="translateTo('Chinese','zh')">中文</button>
<button class="lang-btn" onclick="translateTo('French','fr')">Français</button>
<span style="display:inline-block;width:1px;height:20px;background:rgba(201,169,110,0.2);margin:0 6px;vertical-align:middle"></span>
<button class="lang-btn" onclick="openGoogleTranslate()" title="100+ languages via Google Translate">More languages...</button>
<div id="langStatus" style="font-size:12px;color:var(--slate,#6b7394);margin-top:8px"></div>
</div>
</div>
</div>
</section>
<section class="section section-grad" style="text-align:center;min-height:auto;padding:80px 24px">
<div class="container"><h2 style="color:var(--cream)" id="ctaHead">Have Questions?</h2>
<p style="color:var(--wgray);max-width:500px;margin:12px auto 0" id="ctaSub">Alex is here to help — whether you're researching or ready to move.</p>
<div style="margin-top:32px"><a href="/contact" class="btn btn-gold" id="ctaBtn">Get in Touch</a></div></div></section>
${footHTML}
${scriptHTML}
<script>
var origHTML="",curLang="en",cache={};
var ctaData={en:{h:"Have Questions?",s:"Alex is here to help — whether you're researching or ready to move.",b:"Get in Touch"},ru:{h:"Есть вопросы?",s:"Алекс всегда готов помочь — звоните или пишите.",b:"Связаться"},es:{h:"¿Tiene preguntas?",s:"Alex está aquí para ayudar.",b:"Contáctenos"},he:{h:"?יש שאלות",s:".אלכס כאן לעזור",b:"צרו קשר"},pt:{h:"Tem perguntas?",s:"Alex está aqui para ajudar.",b:"Entre em contato"},zh:{h:"有问题吗？",s:"Alex随时为您服务。",b:"联系我们"},fr:{h:"Des questions ?",s:"Alex est là pour vous aider.",b:"Contactez-nous"}};
function setCta(lang){var d=ctaData[lang]||ctaData.en;document.getElementById("ctaHead").textContent=d.h;document.getElementById("ctaSub").textContent=d.s;document.getElementById("ctaBtn").textContent=d.b;}
function translateTo(langName,code){
  var art=document.getElementById("blogArticle");
  var status=document.getElementById("langStatus");
  // Toggle back to English
  if(curLang===code){art.innerHTML=origHTML;curLang="en";setCta("en");status.textContent="";
    document.querySelectorAll(".lang-btn").forEach(function(b){b.classList.remove("active")});return;}
  if(!origHTML)origHTML=art.innerHTML;
  // Check cache
  if(cache[code]){art.innerHTML=cache[code];curLang=code;setCta(code);
    document.querySelectorAll(".lang-btn").forEach(function(b){b.classList.remove("active")});
    document.querySelector('[onclick*="'+code+'"]').classList.add("active");
    status.textContent="Translated to "+langName+". Click again for English.";return;}
  status.innerHTML='<span class="lang-spinner"></span> Translating to '+langName+'...';
  fetch("/.netlify/functions/api",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({system:"Translate the following HTML blog post to "+langName+". Keep ALL HTML tags, links, images, and formatting exactly the same. Only translate the text content. Maintain a warm, professional real estate tone. Return ONLY the translated HTML, nothing else.",
      content:origHTML,max_tokens:3000})})
  .then(function(r){return r.json();})
  .then(function(data){
    var text=(data.content||[]).map(function(c){return c.text||"";}).join("");
    if(text){cache[code]=text;art.innerHTML=text;curLang=code;setCta(code);
      document.querySelectorAll(".lang-btn").forEach(function(b){b.classList.remove("active")});
      document.querySelector('[onclick*="'+code+'"]').classList.add("active");
      status.textContent="Translated to "+langName+". Click again for English.";}
    else{status.textContent="Translation unavailable. Try again.";}
  })
  .catch(function(){status.textContent="Translation error. Please try again.";});
}
function openGoogleTranslate(){window.open("https://translate.google.com/translate?sl=en&tl=es&u="+encodeURIComponent(window.location.href),"_blank");}
</script>
</body></html>`;
}

// ===== BLOG POSTS =====
const posts=[
{slug:"moving-new-york-to-parkland-florida",title:"Moving from New York to Parkland Florida: Complete 2026 Guide",desc:"Everything NYC, NJ, CT families need to know about relocating to Parkland FL. Taxes, schools, community, cost of living.",tag:"Relocation",excerpt:"Considering the move from New York to Parkland? Here's what a fellow transplant wants you to know.",
body:`<h1>Moving from New York to Parkland, Florida: The Complete 2026 Guide</h1>
<div class="blog-meta"><span>March 15, 2026</span><span class="blog-tag">Relocation</span><span>By Alex Sverdlik</span></div>
<p>Every year, thousands of families leave the New York metro area for Southeast Florida. The reasons are well-documented: no state income tax, more space, better weather, and a cost of living that doesn't sacrifice quality.</p>
<p>But reading statistics is different from living the move. I've been through major relocations myself — from the Northeast to Silicon Valley to Los Angeles to Parkland. Here's what I tell every family considering the same journey.</p>
<h2>The Financial Case Is Overwhelming</h2>
<p>New York's combined state and city income tax can reach 14.7%. Florida: zero. For a family earning $500K, that's $60K+ annually. Over a decade, that's potentially $600K that stays in your pocket. <a href="/blog/florida-vs-new-york-taxes">See the detailed tax comparison →</a></p>
<p>What $1.5M buys in <a href="/neighborhoods">Parkland</a> — 4,000+ sq ft with a pool in a gated community — would cost $3M+ in Westchester and significantly more in Manhattan.</p>
<h2>Schools Are Better Than You Think</h2>
<p>My own daughters attended <a href="/blog/best-private-schools-parkland">Pinecrest Academy</a> in Parkland and went on to Michigan Ross and UF pre-med. The private school landscape here rivals anywhere. <a href="/lifestyle">Learn more about Parkland schools →</a></p>
<h2>Your Community Is Already Here</h2>
<p>For observant Jewish families, Parkland offers <a href="/community">synagogues within walking distance</a>, eruv coverage, kosher dining, and Jewish day schools. <a href="/blog/kosher-community-parkland-boca-raton">Read the full community guide →</a></p>
<h2>And Yes, the Food</h2>
<p>You can get a real bagel down here. Check the <a href="/lifestyle">Tastes Like Home guide</a> for honest recommendations from a New Yorker.</p>
<p>I help Northeast families make this transition every month. <a href="/contact">Let's talk about your move.</a></p>`},

{slug:"florida-vs-new-york-taxes",title:"Florida vs New York Taxes: What Relocating Families Save in 2026",desc:"Detailed FL vs NY tax comparison. Income tax, property tax, estate tax, homestead exemption. By a broker with Smith Barney finance background.",tag:"Finance",excerpt:"The tax savings of moving from New York to Florida are substantial — here's the breakdown.",
body:`<h1>Florida vs New York Taxes: What Relocating Families Save in 2026</h1>
<div class="blog-meta"><span>March 1, 2026</span><span class="blog-tag">Finance</span><span>By Alex Sverdlik</span></div>
<p>As someone who spent years at Smith Barney before entering real estate, I think about the tax differential in concrete financial terms.</p>
<h2>State Income Tax</h2>
<p>New York State: up to 10.9%. Add NYC tax (3.876%) and you're at 14.776% marginal. Florida: zero. For a $750K household, that's $80-100K+ annually in savings.</p>
<h2>Property Taxes</h2>
<p>Florida property taxes are roughly comparable to New York's (1.5-2%). However, Florida's homestead exemption reduces assessed value by $50K, and the Save Our Homes amendment caps annual increases at 3%.</p>
<h2>Estate Tax</h2>
<p>New York: up to 16% on estates exceeding $6.94M. Florida: zero. For high-net-worth families, this is often the deciding factor.</p>
<h2>What This Means for Real Estate</h2>
<p>Annual tax savings often cover a significant portion of a luxury home's carrying costs. Your <a href="/neighborhoods">Parkland home</a> effectively costs much less than the sticker price. <a href="/investment">See our investment analysis approach →</a></p>
<p><a href="/contact">Ready to run the numbers for your situation? Let's talk.</a></p>`},

{slug:"best-private-schools-parkland",title:"Best Private Schools in Parkland FL (2026): A Parent's Guide",desc:"Honest guide to Parkland FL private schools: Pinecrest Academy, American Heritage, North Broward Prep. Written by a parent whose daughters attend top universities.",tag:"Schools",excerpt:"Two of my daughters attended Pinecrest and went on to Michigan Ross and UF pre-med. Here's what I know as a parent.",
body:`<h1>Best Private Schools in Parkland FL: A Parent's Firsthand Guide</h1>
<div class="blog-meta"><span>February 20, 2026</span><span class="blog-tag">Schools</span><span>By Alex Sverdlik</span></div>
<p>When families ask about schools, I don't pull up ratings. I tell them about my experience. Two of my daughters attended Pinecrest Academy in Parkland. One went to Michigan Ross. The other is in pre-med at UF. Our eldest attended high school in La Cañada, California and graduated from Princeton.</p>
<h2>Pinecrest Academy</h2>
<p>A tuition-free public charter school with private-school quality. Strong academics, involved parents, and a track record of placing students at top universities.</p>
<h2>American Heritage School</h2>
<p>Private college-prep with campuses in Plantation and Delray Beach. Rigorous STEM focus. Consistently ranked among Florida's top private schools.</p>
<h2>North Broward Preparatory</h2>
<p>Part of the Nord Anglia network. Internationally-minded education with strong arts, athletics, and boarding options.</p>
<h2>Which Neighborhoods?</h2>
<p><a href="/neighborhoods">Heron Bay and Watercress</a> offer excellent Pinecrest proximity. Families wanting American Heritage may prefer <a href="/neighborhoods">areas closer to Boca</a>. <a href="/contact">Let me match the right neighborhood to your school priorities.</a></p>`},

{slug:"kosher-community-parkland-boca-raton",title:"Kosher Community Guide: Parkland, Boca Raton & Coral Springs FL",desc:"Jewish community Parkland FL: walking-distance shul, eruv, kosher restaurants, Jewish day schools. Guide for relocating families.",tag:"Community",excerpt:"For Shabbat-observant families relocating to SE Florida — the community is strong and growing.",
body:`<h1>Kosher Community Guide: Parkland, Boca Raton &amp; Coral Springs</h1>
<div class="blog-meta"><span>February 10, 2026</span><span class="blog-tag">Community</span><span>By Alex Sverdlik</span></div>
<p>The biggest concern from observant Jewish families considering a move from the Northeast: "Can I actually live my life the way I do now?" The answer is yes — and in many ways, better.</p>
<h2>Synagogues Within Walking Distance</h2>
<p>Several <a href="/neighborhoods">Parkland neighborhoods</a> offer walking-distance shul access. This is the deciding factor for Shabbat-observant families.</p>
<h2>Eruv Coverage</h2>
<p>Multiple communities maintain active eruvim. I provide specific coverage details relative to properties you're considering.</p>
<h2>Kosher Dining and Shopping</h2>
<p>From restaurants to bakeries to well-stocked kosher grocery sections — families maintaining kosher homes find everything they need. <a href="/lifestyle">See the Tastes Like Home guide →</a></p>
<h2>Jewish Day Schools</h2>
<p>Multiple options across denominations, complementing the excellent <a href="/blog/best-private-schools-parkland">private school landscape</a>.</p>
<p><a href="/contact">Let me show you neighborhoods that fit your community needs.</a></p>`},

{slug:"waterfront-homes-southeast-florida",title:"Waterfront Homes SE Florida: Lakefront to Oceanfront Guide",desc:"Waterfront properties $1M-$25M+ in SE Florida. Lakefront Parkland, Intracoastal Boca Raton, oceanfront Hillsboro Mile. Market guide.",tag:"Waterfront",excerpt:"From peaceful lakefront in Parkland to ultra-luxury oceanfront on Hillsboro Mile — navigating the waterfront market.",
body:`<h1>Waterfront Homes in Southeast Florida: Complete Guide</h1>
<div class="blog-meta"><span>January 28, 2026</span><span class="blog-tag">Waterfront</span><span>By Alex Sverdlik</span></div>
<p>Southeast Florida offers waterfront at every price point. Whether lakefront for family paddleboarding, deep-water Intracoastal for yachts, or direct oceanfront — the options are remarkable.</p>
<h2>Lakefront &amp; Canal: $1M–$3.5M</h2>
<p><a href="/neighborhoods">Parkland communities</a> like Heron Bay and MiraLago combine water views with top schools and gated security.</p>
<h2>Intracoastal: $2M–$8M</h2>
<p>Boca Raton, Lighthouse Point, and Fort Lauderdale deliver deep-water lots, serious boat access, and coastal culture.</p>
<h2>Oceanfront: $5M–$25M+</h2>
<p><a href="/blog/hillsboro-mile-waterfront-secret">Hillsboro Mile</a> is SE Florida's best-kept secret — a barrier island with Atlantic frontage and unmatched exclusivity.</p>
<h2>Investment Case</h2>
<p>Waterfront outperforms non-waterfront in appreciation. Combined with Florida's <a href="/blog/florida-vs-new-york-taxes">tax environment</a>, the returns are compelling. <a href="/investment">See our investment approach →</a></p>
<p><a href="/contact">Let's explore your waterfront options.</a></p>`},

{slug:"hillsboro-mile-waterfront-secret",title:"Hillsboro Mile: South Florida's Best-Kept Waterfront Secret",desc:"Hillsboro Mile homes $5M-$25M+. Ultra-exclusive oceanfront enclave. Private beaches, direct ocean, Intracoastal frontage.",tag:"Luxury",excerpt:"A barrier island with water on both sides, private beaches, and exclusivity that money alone can't buy.",
body:`<h1>Hillsboro Mile: South Florida's Best-Kept Waterfront Secret</h1>
<div class="blog-meta"><span>January 15, 2026</span><span class="blog-tag">Luxury</span><span>By Alex Sverdlik</span></div>
<p>Most people have never heard of Hillsboro Mile. That's by design. This narrow barrier island sits between the Intracoastal and the Atlantic, offering exclusivity that doesn't exist anywhere else in Southeast Florida.</p>
<h2>What Makes It Special</h2>
<p>Estates with water on both sides. Private beaches. No high-rises, no commercial development. Some properties have both ocean AND Intracoastal frontage.</p>
<h2>The Market: $5M to $25M+</h2>
<p>Inventory is extremely limited. When something comes available, serious buyers move fast.</p>
<h2>Who Buys Here</h2>
<p>Ultra-high-net-worth individuals seeking privacy. Many are <a href="/relocating-northeast">Northeast</a> and <a href="/relocating-california">California</a> transplants who've sold $10M+ properties elsewhere. <a href="/blog/international-buyers-florida-real-estate">International investors</a> also gravitate here.</p>
<p><a href="/contact">Let's have a private conversation about current availability.</a></p>`},

{slug:"1031-exchange-florida-guide",title:"1031 Exchange in Florida Real Estate: Investor's Guide 2026",desc:"1031 exchange guide for Florida real estate. Timelines, rules, replacement properties. By a broker with Smith Barney background.",tag:"Investment",excerpt:"I've helped clients close 1031 exchanges with as little as 15 days. Here's what investors need to know.",
body:`<h1>1031 Exchange in Florida Real Estate: Investor's Guide</h1>
<div class="blog-meta"><span>January 5, 2026</span><span class="blog-tag">Investment</span><span>By Alex Sverdlik</span></div>
<p>A 1031 exchange defers capital gains taxes — but the timeline is unforgiving: 45 days to identify, 180 days to close. Miss either deadline and you owe the full bill.</p>
<h2>Why Florida Is Ideal</h2>
<p>No state income tax means your 1031 savings are amplified. In <a href="/blog/florida-vs-new-york-taxes">California or New York</a>, even a successful 1031 still faces state capital gains. In Florida: nothing.</p>
<h2>The 15-Day 1031</h2>
<p>I once helped a client identify and close in just 15 days. This illustrates why having a broker with <a href="/investment">deep market knowledge and financial fluency</a> is critical.</p>
<h2>SE Florida's Opportunity</h2>
<p>The <a href="/waterfront">waterfront market</a> offers strong cap rates, consistent appreciation, and high rental demand — excellent for 1031 capital.</p>
<p><a href="/contact">Planning a 1031? Let's strategize.</a></p>`},

{slug:"relocating-california-to-florida",title:"Relocating California to Florida: Silicon Valley Transplant Guide",desc:"Moving from California/Silicon Valley to Florida? Alex lived in Marin, worked at Shipwire.com, sold homes in La Cañada.",tag:"Relocation",excerpt:"I lived in Marin, worked in Silicon Valley, sold homes in La Cañada. Here's what I know about the CA-to-FL transition.",
body:`<h1>Relocating from California to Florida: A Transplant's Guide</h1>
<div class="blog-meta"><span>December 20, 2025</span><span class="blog-tag">Relocation</span><span>By Alex Sverdlik</span></div>
<p>The California-to-Florida pipeline is a structural shift. I've lived it — from Silicon Valley (early team at Shipwire.com) to Marin County to La Cañada Flintridge, where I became a top Zip Realty producer in the LA luxury market.</p>
<h2>The Tax Math</h2>
<p>California's top rate: 13.3%. Florida: zero. For a tech exec earning $1M+, that's $130K+ annually. <a href="/blog/florida-vs-new-york-taxes">See the full tax comparison →</a></p>
<h2>What You Gain</h2>
<p>What $2M buys in <a href="/neighborhoods">Parkland</a> — 5,000+ sq ft on an acre — would cost $5M+ in Pasadena, $7M in Marin.</p>
<h2>I Know Both Markets</h2>
<p>Having sold luxury homes in LA and now specializing in <a href="/waterfront">SE Florida waterfront</a>, I speak both languages. <a href="/relocating-california">Learn more →</a></p>
<p><a href="/contact">Let's talk about your California-to-Florida move.</a></p>`},

{slug:"russian-speaking-realtor-south-florida",title:"Russian Speaking Realtor South Florida | Русскоговорящий Риелтор",desc:"Russian speaking luxury broker Parkland SE Florida. Алекс Свердлик. $1M-$10M+. Smith Barney background. (626) 644-3476.",tag:"International",excerpt:"Bilingual broker with finance expertise for Russian-speaking buyers in Southeast Florida.",
body:`<h1>Russian Speaking Realtor in South Florida</h1>
<div class="blog-meta"><span>December 10, 2025</span><span class="blog-tag">International</span><span>By Alex Sverdlik</span></div>
<p>For Russian-speaking buyers considering luxury real estate in Southeast Florida, finding a broker who speaks your language — both literally and financially — makes all the difference.</p>
<h2>Полный Спектр Услуг на Русском</h2>
<p>Complete real estate services in Russian, from consultation through closing. Every conversation, document review, and negotiation in your preferred language.</p>
<h2>Finance Background</h2>
<p>With Smith Barney and Silicon Valley experience, Alex understands <a href="/investment">investment structures</a>, international buyer tax implications, and portfolio strategy — in the language you're most comfortable with.</p>
<h2>Luxury Market</h2>
<p>$1M to $10M+ across <a href="/neighborhoods">Parkland</a>, Boca Raton, Fort Lauderdale, and <a href="/waterfront">waterfront communities</a>.</p>
<p>Звоните: ${PHONE}. <a href="/ru">Русская версия сайта →</a></p>`},

{slug:"international-buyers-florida-real-estate",title:"International Buyers: Florida Real Estate Purchase Guide",desc:"Guide for international buyers: purchasing Florida real estate as non-citizen. LLC structures, FIRPTA, property management.",tag:"International",excerpt:"Purchasing Florida real estate as a foreign national — what you need to know.",
body:`<h1>Buying Florida Real Estate as an International Buyer</h1>
<div class="blog-meta"><span>November 28, 2025</span><span class="blog-tag">International</span><span>By Alex Sverdlik</span></div>
<p>Southeast Florida is one of the world's most active markets for international investment. Buyers from Russia, Latin America, Canada, Israel, and Europe are drawn to lifestyle, tax benefits, and strong property fundamentals.</p>
<h2>Can Non-Citizens Buy?</h2>
<p>Yes. No restrictions on foreign nationals purchasing residential or commercial real estate in Florida.</p>
<h2>LLC Structures</h2>
<p>Many international buyers purchase through a Florida LLC for liability protection, privacy, and potential tax advantages.</p>
<h2>FIRPTA</h2>
<p>The Foreign Investment in Real Property Tax Act requires withholding upon sale. Understanding this upfront saves significant money. My <a href="/investment">finance background</a> helps navigate these considerations.</p>
<h2>Property Management</h2>
<p>For non-full-time <a href="/waterfront">waterfront properties</a>, I work with trusted management companies handling maintenance and rental income.</p>
<p>Available in <a href="/ru">Russian</a> and English. <a href="/contact">Let's discuss your investment.</a></p>`}
];

// ===== MERGE DASHBOARD POSTS =====
// Dashboard posts override hardcoded posts with the same slug.
// New dashboard posts are added to the front (newest first).
if(dashboardPosts.length>0){
  const hardcodedSlugs=new Set(posts.map(p=>p.slug));
  dashboardPosts.forEach(dp=>{
    // Ensure required fields
    if(!dp.slug||!dp.body)return;
    if(!dp.excerpt){
      const m=(dp.body||"").match(/<p>([\s\S]*?)<\/p>/);
      dp.excerpt=(m?m[1].replace(/<[^>]+>/g,"").trim():"").substring(0,180);
    }
    if(!dp.desc)dp.desc=dp.excerpt;
    if(hardcodedSlugs.has(dp.slug)){
      // Replace hardcoded version
      const idx=posts.findIndex(p=>p.slug===dp.slug);
      if(idx>=0){posts[idx]={...posts[idx],...dp};console.log(`  ↻ Updated: ${dp.slug}`);}
    }else{
      // New post — add to front
      posts.unshift(dp);
      console.log(`  + New: ${dp.slug}`);
    }
  });
}

// ===== PROCESS IMAGES IN ALL POSTS =====
// Sharp is async, so wrap everything from here down in an async IIFE.
(async()=>{
console.log("\n📷 Processing images...");
const allTasks=[];
posts.forEach(p=>{
  if(p.body&&p.body.includes("data:image")){
    const{html,tasks}=extractImages(p.body,p.slug);
    p.body=html;
    allTasks.push(...tasks);
  }
});
await Promise.all(allTasks);
console.log("");

// Generate blog index
const blogIndex=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blog | Alex Sverdlik | Parkland FL Real Estate Insights</title>
<meta name="description" content="Expert insights on SE Florida real estate: relocation guides, market analysis, investment strategy, schools, community. By Alex Sverdlik, luxury broker.">
<link rel="canonical" href="${SITE}/blog">
<meta property="og:title" content="Blog | Alex Sverdlik Real Estate">
<meta property="og:description" content="Expert insights on Southeast Florida real estate.">
<meta property="og:url" content="${SITE}/blog">
<meta property="og:type" content="website">
<style>${CSS}${BCSS}</style>
</head>
<body>
${navWithBlog}
<section class="section section-light" style="padding-top:140px">
<div class="container">
<div class="breadcrumbs"><a href="/">Home</a><span>›</span>Blog</div>
<h1 style="margin-top:24px">Insights &amp; Guides</h1>
<p class="subtitle">Expert perspectives on Southeast Florida real estate, relocation, investment, and lifestyle.</p>
<div class="divider" style="margin-bottom:40px"></div>
${posts.map(p=>`<article class="blog-card">
<h3><a href="/blog/${p.slug}">${p.title}</a></h3>
<div class="blog-meta"><span class="blog-tag">${p.tag}</span></div>
<p>${p.excerpt}</p>
<a href="/blog/${p.slug}" style="color:var(--gold);font-weight:600;font-size:14px;margin-top:8px;display:inline-block">Read more →</a>
</article>`).join("")}
</div>
</section>
${footHTML}
${scriptHTML}
</body></html>`;

// Write blog files
fs.mkdirSync(`${OUT}/blog`,{recursive:true});
fs.writeFileSync(`${OUT}/blog/index.html`,blogIndex);
console.log("✓ blog/index.html");

posts.forEach(p=>{
  fs.writeFileSync(`${OUT}/blog/${p.slug}.html`,blogPage(p.title,p.desc,p.slug,p.body));
  console.log(`✓ blog/${p.slug}.html`);
});

// Update sitemap
const blogPaths=posts.map(p=>`  <url><loc>${SITE}/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
let sitemap=fs.readFileSync(`${OUT}/sitemap.xml`,"utf8");
sitemap=sitemap.replace("</urlset>",
  `  <url><loc>${SITE}/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n${blogPaths.join("\n")}\n</urlset>`);
fs.writeFileSync(`${OUT}/sitemap.xml`,sitemap);
console.log("✓ sitemap.xml updated");

// Update _redirects
let redir=fs.readFileSync(`${OUT}/_redirects`,"utf8");
redir+=`/blog    /blog/index.html    200\n`;
posts.forEach(p=>{redir+=`/blog/${p.slug}    /blog/${p.slug}.html    200\n`});
fs.writeFileSync(`${OUT}/_redirects`,redir);
console.log("✓ _redirects updated");

console.log(`\nDone! Blog index + ${posts.length} posts built.`);
console.log(`Total blog pages: ${posts.length + 1}`);
})().catch(err=>{console.error("\n❌ Build failed:",err);process.exit(1);});
