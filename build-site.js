const fs = require("fs");
const path = require("path");

// ╔══════════════════════════════════════════════════════════════════╗
// ║                                                                ║
// ║   ⚡⚡⚡  FILL IN THESE 5 THINGS  ⚡⚡⚡                        ║
// ║                                                                ║
// ║   Just replace what's between the quotes on each line.         ║
// ║   Don't delete the quotes. Don't change anything else.         ║
// ║                                                                ║
// ╚══════════════════════════════════════════════════════════════════╝

const CONFIG = {

  // 1. WEBSITE ADDRESS
  //    Replace with Alex's domain once you buy it
  //    Example: "https://alexsverdlik.com"
  domain: "https://alexsverdlik.com",

  // 2. ALEX'S PHONE NUMBER
  //    This appears on every page of the site
  phone: "(626) 644-3476",

  // 3. ALEX'S EMAIL
  //    Used in Google search data (not shown on site)
  email: "alex@alexsverdlik.com",

  // 4. FORMSPREE FORM ID
  //    Go to formspree.io, create free account, make a form.
  //    Copy the ID they give you (looks like: xabcdefg)
  //    Paste it here between the quotes.
  //    Leave as "YOUR_FORM_ID" until you have one — contact page still works.
  //    IMPORTANT: Set the form's email to asverdlik@gmail.com in Formspree settings.
  formspreeId: "YOUR_FORM_ID",

  // 4b. ALEX'S EMAIL (for lead notifications from AI chat)
  notifyEmail: "asverdlik@gmail.com",

  // 5. BOLDTRAIL SEARCH PAGE (optional — leave blank for now)
  //    When Alex gets his BoldTrail website URL from ZenQuest,
  //    paste it here. This adds live MLS home search to the site.
  //    Example: "https://alexsverdlik.boldtrail.com"
  //    Leave as "" until Alex has it.
  boldtrailUrl: "",

  // -------- STOP HERE — don't change anything below --------
  outputDir: path.join(__dirname, "dist"),
};

// ╔════════════════════════════════════════════════════════════╗
// ║  ✅ DONE — Nothing below needs editing.                   ║
// ║  Run: node build-site.js                                  ║
// ║  Then: node build-blog.js                                 ║
// ║  Output goes to: ./site-build/                            ║
// ╚════════════════════════════════════════════════════════════╝

const SITE = CONFIG.domain;
const PHONE = CONFIG.phone;
const OUT = CONFIG.outputDir;

// ===== SHARED STYLES =====
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
:root{--navy:#1a1f2e;--dnavy:#12151f;--gold:#c9a96e;--goldl:#e0c98f;--cream:#f5f0e8;--warm:#faf8f4;--char:#2d3142;--slate:#6b7394;--wgray:#9a9ab0;--white:#fff;--fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',sans-serif}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--fb);color:var(--char);background:var(--warm);overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;height:auto;display:block}
.container{max-width:1200px;margin:0 auto;padding:0 24px}
.section{padding:100px 24px}
.section-dark{background:var(--navy);color:var(--cream)}
.section-grad{background:linear-gradient(170deg,var(--dnavy),var(--navy) 50%,#1e2a3a)}
.section-light{background:var(--warm);color:var(--char)}

/* Typography */
h1{font-family:var(--fd);font-size:clamp(36px,6vw,72px);font-weight:700;line-height:1.1;color:var(--navy)}
h2{font-family:var(--fd);font-size:clamp(28px,4vw,48px);font-weight:700;line-height:1.15;margin-bottom:16px}
h3{font-family:var(--fd);font-size:clamp(20px,2.5vw,28px);font-weight:600;line-height:1.3}
h4{font-family:var(--fd);font-size:clamp(18px,2vw,22px);font-weight:600}
p{font-size:clamp(15px,1.6vw,17px);line-height:1.8;font-weight:300}
.gold{color:var(--gold)}
.cream{color:var(--cream)}
.subtitle{color:var(--slate);margin-top:12px;max-width:650px}
.subtitle-dark{color:var(--wgray)}
.divider{width:50px;height:2px;background:var(--gold);margin:20px 0 0}
.center{text-align:center;margin-left:auto;margin-right:auto}
.divider.center{margin:20px auto 0}

/* Nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all .4s}
.nav.scrolled{background:rgba(26,31,46,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(201,169,110,.12)}
.nav-inner{max-width:1400px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:76px;transition:height .3s}
.nav.scrolled .nav-inner{height:60px}
.nav-logo{font-family:var(--fd);font-size:20px;color:var(--gold);font-weight:700;letter-spacing:1.5px}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:var(--wgray);transition:color .3s;font-weight:400}
.nav-links a:hover,.nav-links a.active{color:var(--gold)}
.nav-lang{border:1px solid var(--gold);border-radius:3px;color:var(--gold);font-size:11px;padding:5px 12px;letter-spacing:1.5px;background:none;cursor:pointer;transition:all .3s}
.nav-lang:hover{background:var(--gold);color:var(--dnavy)}
.hamburger{display:none;flex-direction:column;gap:6px;background:none;border:none;cursor:pointer;padding:10px}
.hamburger span{width:26px;height:2px;background:var(--gold);display:block;transition:all .3s}
.mobile-menu{display:none;background:rgba(18,21,31,.99);padding:16px 24px 32px;flex-direction:column;gap:4px}
.mobile-menu.open{display:flex}
.mobile-menu a{font-size:17px;padding:14px 16px;color:var(--wgray);border-radius:6px;transition:all .2s}
.mobile-menu a:hover,.mobile-menu a.active{color:var(--gold);background:rgba(201,169,110,.08)}

/* Buttons */
.btn{font-family:var(--fb);font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:16px 36px;border-radius:3px;cursor:pointer;transition:all .3s;border:none;display:inline-block;text-align:center}
.btn-gold{background:var(--gold);color:var(--dnavy)}
.btn-gold:hover{background:var(--goldl);transform:translateY(-2px);box-shadow:0 8px 30px rgba(201,169,110,.3)}
.btn-outline{background:transparent;border:1px solid var(--wgray);color:var(--cream)}
.btn-outline:hover{border-color:var(--gold);color:var(--gold)}

/* Cards */
.card{background:var(--white);border:1px solid rgba(45,49,66,.07);border-radius:5px;padding:clamp(24px,4vw,36px);transition:transform .4s,box-shadow .4s}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.08)}
.card-dark{background:rgba(255,255,255,.035);border-color:rgba(201,169,110,.12)}
.card-dark:hover{box-shadow:0 16px 48px rgba(0,0,0,.3)}
.card-gold{border-left:3px solid var(--gold)}

/* Grids */
.grid{display:grid;gap:24px}
.grid-2{grid-template-columns:repeat(2,1fr)}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-4{grid-template-columns:repeat(2,1fr)}
.grid-about{grid-template-columns:380px 1fr;gap:60px}

/* Badges */
.badge{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border-radius:2px;display:inline-block}
.badge-gold{color:var(--gold);background:rgba(201,169,110,.1)}

/* Community features */
.feature-row{display:flex;align-items:start;gap:14px;padding:clamp(16px,2.5vw,20px) clamp(16px,2.5vw,24px);background:rgba(255,255,255,.03);border-radius:5px;border-left:3px solid var(--gold);margin-bottom:14px}
.feature-row .star{color:var(--gold);font-size:13px;margin-top:3px;flex-shrink:0}
.feature-row p{color:var(--cream);font-weight:300;margin:0}

/* Hero */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(165deg,var(--dnavy) 0%,var(--navy) 40%,#1e2a3a 100%);position:relative;overflow:hidden;padding:140px 24px 100px}
.hero::before{content:'';position:absolute;top:8%;right:3%;width:420px;height:420px;background:radial-gradient(circle,rgba(201,169,110,.06) 0%,transparent 70%);border-radius:50%}
.hero::after{content:'';position:absolute;bottom:12%;left:2%;width:300px;height:300px;background:radial-gradient(circle,rgba(201,169,110,.04) 0%,transparent 70%);border-radius:50%}
.hero-content{position:relative;z-index:1;max-width:900px}
.hero h1{color:var(--cream)}
.hero h1 em{color:var(--gold);font-style:italic}
.hero-tag{font-size:clamp(11px,1.5vw,13px);letter-spacing:5px;text-transform:uppercase;color:var(--gold);margin-bottom:28px}
.hero-sub{color:var(--wgray);max-width:560px;margin:28px auto 0}
.hero-btns{display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.paths{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:64px}
.path-card{background:rgba(255,255,255,.025);border:1px solid rgba(201,169,110,.18);border-radius:5px;padding:24px 16px;cursor:pointer;transition:all .3s;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;color:var(--cream);font-size:clamp(13px,1.5vw,14px)}
.path-card:hover{border-color:var(--gold);background:rgba(201,169,110,.06)}

/* About photo placeholder */
.about-photo{width:100%;aspect-ratio:3/4;background:linear-gradient(135deg,var(--navy),var(--char));border-radius:5px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,169,110,.18);position:relative;overflow:hidden;text-align:center}
.about-photo .initials{font-family:var(--fd);font-size:clamp(48px,8vw,64px);color:var(--gold)}
.about-photo .label{font-size:11px;color:var(--wgray);letter-spacing:3px;margin-top:10px;text-transform:uppercase}

/* Credentials */
.cred{font-size:13px;color:var(--slate);padding:11px 14px;background:rgba(201,169,110,.06);border-left:3px solid var(--gold);border-radius:2px}

/* Quote card */
.quote-card{position:relative}
.quote-card .mark{font-family:var(--fd);font-size:56px;color:rgba(201,169,110,.1);position:absolute;top:12px;left:20px;line-height:1}
.quote-card blockquote{font-style:italic;position:relative;margin:16px 0 20px;padding:0}
.quote-card .author{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid rgba(45,49,66,.07);flex-wrap:wrap;gap:8px}
.quote-card .author-name{font-size:13px;font-weight:600;color:var(--navy)}

/* Featured reviews stack (homepage) */
.featured-stack{display:flex;flex-direction:column;gap:24px;max-width:760px;margin:48px auto 0}
.featured-stack-card{background:var(--white);border:1px solid rgba(45,49,66,.07);border-left:3px solid var(--gold);border-radius:5px;padding:clamp(28px,4vw,40px)}
.featured-stack-card .mark{font-family:var(--fd);font-size:56px;color:rgba(201,169,110,.18);line-height:1;margin-bottom:4px}
.featured-stack-card blockquote{font-family:var(--fd);font-style:italic;font-size:clamp(17px,2vw,21px);line-height:1.55;color:var(--char);margin:0 0 20px;padding:0}
.featured-stack-card .author{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid rgba(45,49,66,.07);flex-wrap:wrap;gap:12px}
.featured-stack-card .author-name{font-family:var(--fb);font-size:15px;font-weight:600;color:var(--navy)}
.featured-stack-cta{display:block;text-align:center;margin-top:32px;font-family:var(--fb);font-size:14px;font-weight:600;color:var(--gold);text-decoration:none;transition:opacity .2s}
.featured-stack-cta:hover{opacity:.7}

/* Contact form */
.form-group{margin-bottom:18px}
.form-group label{font-size:11px;color:var(--wgray);letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:7px}
.form-group input,.form-group textarea,.form-group select{width:100%;padding:14px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(201,169,110,.2);border-radius:4px;color:var(--cream);font-family:var(--fb);font-size:16px;outline:none;transition:border-color .3s}
.form-group input:focus,.form-group textarea:focus{border-color:var(--gold)}

/* Footer */
.footer{background:var(--dnavy);padding:clamp(32px,5vw,48px) 24px;text-align:center;border-top:1px solid rgba(201,169,110,.08)}
.footer .logo{font-family:var(--fd);font-size:18px;color:var(--gold);margin-bottom:10px;letter-spacing:1.5px}
.footer p{font-size:13px;color:var(--wgray);margin-bottom:3px}
.footer .copy{font-size:11px;color:rgba(154,154,176,.4);margin-top:20px}

/* Responsive */
@media(max-width:1024px){
  .nav-links{display:none}
  .hamburger{display:flex}
  .grid-about{grid-template-columns:1fr;gap:40px}
  .grid-3{grid-template-columns:1fr 1fr}
  .about-photo{max-width:320px;margin:0 auto}
  .section{padding:80px 24px}
}
@media(max-width:767px){
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .grid-about{grid-template-columns:1fr;gap:32px}
  .section{padding:64px 20px}
  .hero{padding:100px 20px 64px}
  .paths{grid-template-columns:1fr;gap:12px}
  .path-card{flex-direction:row;padding:18px 20px}
  .hero-btns{flex-direction:column;align-items:stretch}
  .btn{width:100%}
  .about-photo{max-width:260px;margin:0 auto}
  .card:hover{transform:none}
  .cred-grid{grid-template-columns:1fr !important}
}
@media(max-width:380px){
  .section{padding:48px 16px}
  .hero{padding:88px 16px 48px}
}
`;

// ===== SCHEMA MARKUP =====
const SCHEMA_AGENT = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Alex Sverdlik",
  "telephone": "+16266443476",
  "email": CONFIG.email,
  "url": SITE,
  "image": `${SITE}/images/alex-sverdlik.jpg`,
  "description": "Luxury real estate broker in Parkland, FL specializing in $1M-$10M+ properties, waterfront estates, and relocation from the Northeast and California. Bilingual English/Russian.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Coral Springs",
    "addressLocality": "Coral Springs",
    "addressRegion": "FL",
    "postalCode": "33067",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 26.3109, "longitude": -80.2456 },
  "areaServed": [
    { "@type": "City", "name": "Parkland, FL" },
    { "@type": "City", "name": "Boca Raton, FL" },
    { "@type": "City", "name": "Coral Springs, FL" },
    { "@type": "City", "name": "Fort Lauderdale, FL" },
    { "@type": "City", "name": "Lighthouse Point, FL" },
    { "@type": "City", "name": "Deerfield Beach, FL" }
  ],
  "knowsLanguage": ["en", "ru"],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Real Estate Broker License",
    "recognizedBy": { "@type": "Organization", "name": "Florida DBPR" }
  },
  "worksFor": { "@type": "RealEstateAgent", "name": "ZenQuest Realty" },
  "sameAs": [
    "https://www.zillow.com/profile/Alex%20Sverdlik",
    "https://www.yelp.com/biz/alex-sverdlik-real-broker-parkland"
  ]
}, null, 2);

// ===== NAV BUILDER =====
function nav(activePath, isRussian) {
  const links = [
    { href: "/", label: "Home", ru: "Главная" },
    { href: "/about", label: "About", ru: "Обо мне" },
    { href: "/relocating-northeast", label: "Relocate NE", ru: "С северо-востока" },
    { href: "/relocating-california", label: "Relocate CA", ru: "Из Калифорнии" },
    { href: "/neighborhoods", label: "Neighborhoods", ru: "Районы" },
    { href: "/waterfront", label: "Waterfront", ru: "На воде" },
    { href: "/lifestyle", label: "Lifestyle", ru: "Жизнь" },
    { href: "/community", label: "Community", ru: "Сообщество" },
    { href: "/investment", label: "Investment", ru: "Инвестиции" },
    { href: "/testimonials", label: "Stories", ru: "Отзывы" },
    { href: "/blog", label: "Blog", ru: "Блог" },
    { href: "/search", label: "Search Homes", ru: "Поиск" },
    { href: "/contact", label: "Contact", ru: "Контакт" },
  ];
  const langLink = isRussian ? `<a href="/" class="nav-lang">EN</a>` : `<a href="/ru" class="nav-lang">RU</a>`;
  return `
  <nav class="nav" id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">ALEX SVERDLIK</a>
      <div class="nav-links">
        ${links.map(l => `<a href="${l.href}"${activePath === l.href ? ' class="active"' : ''}>${isRussian ? l.ru : l.label}</a>`).join("\n        ")}
        ${langLink}
      </div>
      <button class="hamburger" onclick="document.getElementById('mob').classList.toggle('open')" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" id="mob">
      ${links.map(l => `<a href="${l.href}"${activePath === l.href ? ' class="active"' : ''}>${isRussian ? l.ru : l.label}</a>`).join("\n      ")}
      ${langLink.replace('class="nav-lang"', 'class="nav-lang" style="display:inline-block;margin:12px 16px;width:fit-content"')}
    </div>
  </nav>`;
}

// ===== FOOTER =====
const FOOTER = [
  '<footer class="footer">',
  '<div class="logo">ALEX SVERDLIK</div>',
  '<p>Broker Associate · ZenQuest Realty · License BK3503241</p>',
  '<p>Coral Springs, FL · ' + PHONE + '</p>',
  '<p class="copy">&copy; ' + new Date().getFullYear() + ' Alex Sverdlik. All rights reserved.</p>',
  '</footer>',
  '<div id="asChatWrap"></div>',
  // Hidden form — Netlify must see this at build time to register "chat-leads" as a valid form
  // The actual chat widget POSTs programmatically to this form endpoint via fetch()
  '<form name="chat-leads" netlify data-netlify="true" hidden>',
  '<input type="text" name="name" />',
  '<input type="email" name="email" />',
  '<input type="tel" name="phone" />',
  '<input type="text" name="language" />',
  '<input type="text" name="interest" />',
  '<input type="text" name="budget" />',
  '<input type="text" name="timeline" />',
  '<input type="text" name="location" />',
  '<input type="text" name="buyer-type" />',
  '<input type="text" name="financial" />',
  '<textarea name="transcript"></textarea>',
  '<textarea name="reply-draft"></textarea>',
  '</form>',
  '<script>window.addEventListener("scroll",function(){document.getElementById("navbar").classList.toggle("scrolled",window.scrollY>50)},{passive:true});</script>',
  '<script src="/chat.js"></script>',
].join("\n  ");

// Chat widget as a separate file (generated during build)
function buildChatJS() {
  var PH_CLEAN = PHONE.replace(/[^0-9]/g, "");
  return '(function(){' +
  'var PH="' + PHONE + '";' +
  'var SYS="You are Alex Sverdlik\'s AI assistant on his luxury real estate website. Help visitors learn about SE Florida real estate.\\n\\nABOUT ALEX: Broker Associate, ZenQuest Realty, Coral Springs FL. 20+ years. Smith Barney, Shipwire.com (Silicon Valley), top Zip Realty producer La Canada/LA. Fluent English/Russian. Wife Dr. Naomi Schechter, radiation oncologist Delray Beach. Daughters: Pinecrest to Michigan Ross, UF premed. Eldest to Princeton. Phone: ' + PHONE + '.\\n\\nAREAS: Parkland, Boca Raton, Coral Springs, Fort Lauderdale, Lighthouse Point, Hillsboro Mile, Deerfield Beach, Highland Beach.\\n\\nSPECIALTIES: Luxury $1M-$10M+, waterfront, NE and CA relocators, Russian-speaking, international investors, 1031 exchanges, medical pros.\\n\\nNEIGHBORHOODS: Heron Bay ($800K-$2.5M), MiraLago ($1.2M-$3.5M), Parkland Golf ($1.5M-$5M+), Watercress ($700K-$1.8M), BBB Ranches ($1.5M-$5M+), Hillsboro Mile ($5M-$25M+).\\n\\nCOMMUNITY: Walking-distance synagogues, eruv, kosher restaurants in Parkland/Boca/Coral Springs, Jewish day schools.\\n\\nBEHAVIOR: Warm, never pushy. 2-4 sentences. Russian if asked. Learn name, interest, timeline, budget naturally through conversation. Never invent listings.\\n\\nLEAD CAPTURE (CRITICAL): As soon as the visitor has shared their NAME and (EMAIL or PHONE), you MUST append a lead marker at the very end of that response, AFTER your normal reply. Do NOT filter by budget, timeline, or seeming seriousness — Alex wants ALL real leads, including lower price points, long timelines, and casual lookers. He has a referral network and partners for different price tiers. The ONLY reason to NOT emit the marker is if the person is obviously testing, joking, or a spammer (e.g. fake names, inappropriate content). If unsure, emit the marker — Alex would rather see it than miss it.\\n\\nMARKER FORMAT (EXACTLY): [LEAD:{\\"name\\":\\"...\\",\\"email\\":\\"...\\",\\"phone\\":\\"...\\",\\"interest\\":\\"...\\",\\"budget\\":\\"...\\",\\"timeline\\":\\"...\\",\\"location\\":\\"...\\",\\"buyerType\\":\\"...\\",\\"financial\\":\\"...\\",\\"lang\\":\\"English\\"}] — Use empty strings for fields you do not yet know. Emit the marker AT LEAST ONCE when name + contact first appear. You MAY emit it again in later turns if new details emerge (e.g. visitor shares budget mid-conversation) — the system handles duplicates cleanly. Put the marker on its own line after your normal reply. The visitor never sees it — it is stripped before display. Do not mention it. Do not wrap it in code blocks or quotes.";' +
  'var GREETING={r:"a",t:"Hi! I\'m Alex\'s assistant. Curious about Parkland, waterfront homes, or relocating to SE Florida? Ask me anything!"};' +
  'var msgs=[GREETING];' +
  'var open=false,busy=false;' +
  'var sty=document.createElement("style");sty.textContent="@keyframes asBounce{to{transform:translateY(-4px);opacity:.4}}";document.head.appendChild(sty);' +
  'function render(){' +
  'var w=document.getElementById("asChatWrap");if(!w)return;w.innerHTML="";' +
  'var b=document.createElement("button");b.style.cssText="position:fixed;bottom:20px;right:20px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#c9a96e,#e0c98f);border:none;cursor:pointer;box-shadow:0 4px 16px rgba(201,169,110,.4);z-index:9999;font-family:Playfair Display,serif;font-size:20px;font-weight:700;color:#1a1f2e;transition:transform .2s";' +
  'b.textContent=open?"\u2715":"AS";b.onclick=function(){' +
  'if(open){sendFinalLead();open=false;}' +
  'else{if(msgs.length>1)resetChat();open=true;}' +
  'render();};w.appendChild(b);' +
  'if(!open)return;' +
  'var win=document.createElement("div");win.style.cssText="position:fixed;bottom:88px;right:20px;width:min(370px,calc(100vw - 40px));height:min(500px,calc(100vh - 120px));background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow:hidden;z-index:9998;font-family:DM Sans,sans-serif";' +
  'var hd=document.createElement("div");hd.style.cssText="background:#1a1f2e;padding:14px 18px;display:flex;align-items:center;gap:10px";' +
  'hd.innerHTML=\'<div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#c9a96e,#e0c98f);display:flex;align-items:center;justify-content:center;font-family:Playfair Display,serif;font-size:15px;font-weight:700;color:#1a1f2e">AS</div><div style="flex:1"><div style="font-weight:600;color:#f5f0e8;font-size:14px">Alex Sverdlik</div><div style="font-size:11px;color:#c9a96e">\u25cf Online</div></div>\';' +
  'var cb=document.createElement("button");cb.style.cssText="background:none;border:none;color:#6b7394;font-size:18px;cursor:pointer";cb.textContent="\u2715";cb.onclick=function(){sendFinalLead();open=false;render();};hd.appendChild(cb);win.appendChild(hd);' +
  'var md=document.createElement("div");md.id="asChatMsgs";md.style.cssText="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f8f7f4";' +
  'msgs.forEach(function(m){var d=document.createElement("div");d.style.cssText="display:flex;justify-content:"+(m.r==="u"?"flex-end":"flex-start");var p=document.createElement("div");p.style.cssText="max-width:82%;padding:9px 13px;font-size:14px;line-height:1.6;font-weight:300;"+(m.r==="u"?"border-radius:14px 14px 3px 14px;background:#1a1f2e;color:#f5f0e8":"border-radius:14px 14px 14px 3px;background:#fff;color:#2d3142;box-shadow:0 1px 3px rgba(0,0,0,.05)");p.textContent=m.t;d.appendChild(p);md.appendChild(d);});' +
  'if(busy){var dt=document.createElement("div");dt.innerHTML=\'<div style="padding:10px 16px;background:#fff;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.05);display:inline-flex;gap:4px"><span style="width:6px;height:6px;border-radius:50%;background:#6b7394;animation:asBounce .6s 0s infinite alternate;display:inline-block"></span><span style="width:6px;height:6px;border-radius:50%;background:#6b7394;animation:asBounce .6s .15s infinite alternate;display:inline-block"></span><span style="width:6px;height:6px;border-radius:50%;background:#6b7394;animation:asBounce .6s .3s infinite alternate;display:inline-block"></span></div>\';md.appendChild(dt);}' +
  'win.appendChild(md);' +
  'if(msgs.length<=1){var qd=document.createElement("div");qd.style.cssText="padding:6px 14px 2px;display:flex;gap:5px;flex-wrap:wrap;background:#f8f7f4";' +
  '["Tell me about Parkland","Waterfront homes","Moving from NYC","Schools info"].forEach(function(q){var qb=document.createElement("button");qb.style.cssText="font-size:11px;padding:5px 10px;border-radius:14px;border:1px solid rgba(201,169,110,.35);background:rgba(201,169,110,.05);color:#c9a96e;cursor:pointer;font-family:inherit";qb.textContent=q;qb.onclick=function(){sendMsg(q);};qd.appendChild(qb);});win.appendChild(qd);}' +
  'var ir=document.createElement("div");ir.style.cssText="padding:10px 14px;border-top:1px solid #eee;display:flex;gap:8px;background:#fff";' +
  'var inp=document.createElement("input");inp.id="asChatInput";inp.placeholder="Ask about Parkland, homes, schools...";inp.style.cssText="flex:1;padding:9px 14px;border-radius:22px;border:1px solid #e0ddd6;background:#f8f7f4;font-family:inherit;font-size:14px;color:#2d3142;outline:none";' +
  'inp.onkeydown=function(e){if(e.key==="Enter"&&inp.value.trim())sendMsg(inp.value.trim());};' +
  'var sb=document.createElement("button");sb.style.cssText="width:38px;height:38px;border-radius:50%;background:#c9a96e;border:none;cursor:pointer;color:#fff;font-size:16px;flex-shrink:0";sb.textContent="\u2191";sb.onclick=function(){if(inp.value.trim())sendMsg(inp.value.trim());};' +
  'ir.appendChild(inp);ir.appendChild(sb);win.appendChild(ir);' +
  'var ft=document.createElement("div");ft.style.cssText="padding:4px 14px 6px;text-align:center;font-size:10px;color:#6b7394";ft.innerHTML=\'ZenQuest Realty \u00b7 <a href="tel:' + PH_CLEAN + '" style="color:#c9a96e">' + PHONE + '</a>\';' +
  'win.appendChild(ft);w.appendChild(win);' +
  'setTimeout(function(){var m=document.getElementById("asChatMsgs");if(m)m.scrollTop=m.scrollHeight;var i=document.getElementById("asChatInput");if(i)i.focus();},50);' +
  '}' +
  'var NOTIFY="' + CONFIG.notifyEmail + '";' +
  'var SIG="\\n\\nBest regards,\\nAlex Sverdlik\\nBroker Associate | ZenQuest Realty\\nCoral Springs, FL\\n' + PHONE + '\\nasverdlik@gmail.com";' +
  // Lead notification system:
  //   - leadSent: true after initial "hi, Alex got a lead" email fires
  //   - leadData: latest merged lead info (keeps track of info added AFTER initial capture)
  //   - finalSent: true after the "final wrap-up" email fires
  //   - Initial email fires on first qualification; Final email fires on chat close / page unload / inactivity
  'var leadSent=false;var finalSent=false;var leadData=null;var idleTimer=null;' +
  // Build the URL-encoded body for a Netlify Forms POST with the current transcript + lead info
  'function buildLeadBody(ld,stage){' +
  'var conv=msgs.map(function(m){return(m.r==="u"?"Visitor: ":"Alex AI: ")+m.t;}).join("\\n");' +
  'var fname=(ld.name||"").split(" ")[0]||"there";' +
  'var draft="Hi "+fname+",\\n\\nThank you for reaching out! I enjoyed our chat and would love to help you with your real estate search"+(ld.interest?(" -- especially regarding "+ld.interest):"")+"."' +
  '+"\\n\\nWould love to learn more about what you are looking for and share some options that might be a great fit. Would you have time for a quick call this week?"' +
  '+"\\n\\nNo pressure at all -- just a friendly conversation to see how I can help."+SIG;' +
  'var params=new URLSearchParams();' +
  'params.append("form-name","chat-leads");' +
  'params.append("name",(ld.name||"Website Visitor")+(stage==="final"?" [FINAL]":""));' +
  'params.append("email",ld.email||"");' +
  'params.append("phone",ld.phone||"");' +
  'params.append("language",ld.lang||"English");' +
  'params.append("interest",ld.interest||"Not specified");' +
  'params.append("budget",ld.budget||"Not discussed");' +
  'params.append("timeline",ld.timeline||"Not discussed");' +
  'params.append("location",ld.location||"Not specified");' +
  'params.append("buyer-type",ld.buyerType||"Not specified");' +
  'params.append("financial",ld.financial||"Not discussed");' +
  'params.append("transcript",conv);' +
  'params.append("reply-draft",draft);' +
  'return params.toString();' +
  '}' +
  // CRM POST helpers — additive path to dashboard-v2 leads-public-create.
  // Email path (above) is the safety net; CRM is the upgrade.
  // Fields where chat data cleanly maps to API enums/types go in body.preferences;
  // free-form fields (budget, timeline, financial, interest, buyerType) get folded
  // into a bullet-list notes string instead of attempting fragile client-side parsing.
  'function buildPublicLeadBody(ld){' +
  'var body={name:ld.name||"Website Visitor"};' +
  'if(ld.email)body.email=ld.email;' +
  'if(ld.phone)body.phone=ld.phone;' +
  'var preferences={};' +
  'if(ld.location)preferences.locations=[ld.location];' +
  'if(ld.lang)preferences.languages=[ld.lang];' +
  'if(Object.keys(preferences).length)body.preferences=preferences;' +
  'var noteLines=["Captured via website chat."];' +
  'if(ld.interest)noteLines.push("- Interest: "+ld.interest);' +
  'if(ld.buyerType)noteLines.push("- Buyer type: "+ld.buyerType);' +
  'if(ld.budget)noteLines.push("- Budget mentioned: "+ld.budget);' +
  'if(ld.timeline)noteLines.push("- Timeline mentioned: "+ld.timeline);' +
  'if(ld.financial)noteLines.push("- Financial readiness: "+ld.financial);' +
  'if(ld.lang)noteLines.push("- Language: "+ld.lang);' +
  'body.notes=noteLines.join("\\n").substring(0,2000);' +
  'try{var campaign=new URLSearchParams(window.location.search).get("campaign");' +
  'if(campaign)body.sourceCampaign=campaign.substring(0,100);}catch(e){}' +
  'return body;' +
  '}' +
  // Outer try/catch wraps the entire body-construction + fetch. Inner .catch
  // handles async network/4xx/5xx. Together: any error in CRM logic is
  // logged-and-swallowed; email path (caller's prior fetch) is unbreakable.
  'function postToCRM(ld){' +
  'try{' +
  'fetch("https://alex-sverdlik-dashboard-v2.netlify.app/.netlify/functions/leads-public-create",{' +
  'method:"POST",headers:{"Content-Type":"application/json"},' +
  'body:JSON.stringify(buildPublicLeadBody(ld)),keepalive:true' +
  '}).catch(function(e){console.error("CRM lead post failed (email path unaffected):",e);});' +
  '}catch(e){' +
  'console.error("CRM lead post threw synchronously (email path unaffected):",e);' +
  '}' +
  '}' +
  // Initial fire: called when AI emits the first [LEAD:...] marker with qualifying info
  'function notifyLead(ld){' +
  'leadData=ld;' +
  'if(leadSent)return;' +   // Silently ignore repeat markers — the final-send path handles updates
  'leadSent=true;' +
  'fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:buildLeadBody(ld,"initial"),keepalive:true}).catch(function(){});' +
  // CRM POST — additive; fail-silent + try/catch wrapped in postToCRM
  'postToCRM(ld);' +
  '}' +
  // Merge new lead info into existing leadData (new non-empty fields overwrite old ones)
  'function mergeLead(ld){' +
  'if(!leadData){leadData=ld;return;}' +
  'Object.keys(ld).forEach(function(k){if(ld[k])leadData[k]=ld[k];});' +
  '}' +
  // Final fire: called on chat close / unload / inactivity. Sends complete updated transcript.
  'function sendFinalLead(){' +
  'if(!leadSent||finalSent||!leadData)return;' +    // No initial capture? Nothing to finalize.
  'if(msgs.length<=3)return;' +   // Don't bother if conversation barely continued past capture
  'finalSent=true;' +
  // keepalive:true is essential — allows the request to complete even as the page unloads
  'fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:buildLeadBody(leadData,"final"),keepalive:true}).catch(function(){});' +
  '}' +
  // Reset inactivity timer — call on every user message / AI response
  'function touchIdle(){' +
  'if(idleTimer)clearTimeout(idleTimer);' +
  'idleTimer=setTimeout(sendFinalLead,120000);' +   // 2 minutes of no activity = conversation ended
  '}' +
  // Fire final summary when user navigates away or closes the tab
  'window.addEventListener("beforeunload",sendFinalLead);' +
  'window.addEventListener("pagehide",sendFinalLead);' +
  // resetChat: wipes conversation state so reopening gives a fresh session
  // Called after the user has closed the chat and reopens it
  'function resetChat(){' +
  'msgs=[GREETING];' +
  'leadSent=false;finalSent=false;leadData=null;' +
  'if(idleTimer){clearTimeout(idleTimer);idleTimer=null;}' +
  '}' +
  'function sendMsg(txt){msgs.push({r:"u",t:txt});busy=true;touchIdle();render();' +
  'var apiMsgs=msgs.map(function(m){return{role:m.r==="a"?"assistant":"user",content:m.t};});' +
  'fetch("/.netlify/functions/api",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:SYS,messages:apiMsgs,max_tokens:400})})' +
  '.then(function(r){return r.json();}).then(function(data){var text=(data.content||[]).map(function(c){return c.text||"";}).join("")||"Having trouble. Call Alex at "+PH+".";' +
  // Parse lead marker: find [LEAD:{...}], parse JSON, merge into leadData, fire initial if not yet sent
  'var lm=text.match(/\\[LEAD:(\\{[^\\]]*\\})\\]/);' +
  'if(lm){try{var ld=JSON.parse(lm[1]);mergeLead(ld);notifyLead(leadData);}catch(e){console.error("Lead parse failed:",e,lm[1]);}text=text.replace(/\\[LEAD:[^\\]]*\\]/g,"").trim();}' +
  'msgs.push({r:"a",t:text});busy=false;touchIdle();render();})' +
  '.catch(function(){msgs.push({r:"a",t:"Sorry, having trouble. Call Alex at "+PH+"."});busy=false;render();});}' +
  'render();})();';
}

// ===== PAGE BUILDER =====
function page({ title, description, path: pg, canonical, body, schema, noindex }) {
  const can = canonical || `${SITE}${pg}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${can}">
  ${noindex ? '<meta name="robots" content="noindex">' : ''}
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${can}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Alex Sverdlik - Luxury Real Estate">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Schema -->
  <script type="application/ld+json">${schema || SCHEMA_AGENT}</script>
  
  <style>${CSS}</style>
</head>
<body>
  ${nav(pg)}
  ${body}
  ${FOOTER}
</body>
</html>`;
}

// ===== CTA BLOCK =====
function ctaBlock(heading, sub) {
  return `
  <section class="section section-grad" style="text-align:center;min-height:auto;padding:80px 24px">
    <div class="container">
      <h2 class="cream">${heading}</h2>
      <p class="subtitle-dark center" style="max-width:500px">${sub}</p>
      <div style="margin-top:32px">
        <a href="/contact" class="btn btn-gold">${heading.includes("Guide") ? "Get the Free Guide" : "Get in Touch"}</a>
      </div>
    </div>
  </section>`;
}

// ===== TESTIMONIAL HELPERS =====
const TRANSACTION_LABELS = {
  "first-time": "First-Time Buyer",
  "waterfront": "Waterfront",
  "1031": "1031 Exchange",
  "luxury": "Luxury",
  "russian-speaking": "Russian-Speaking",
  "relocator": "Relocator",
};
const escapeHtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function renderReviewCard(r) {
  const badge = TRANSACTION_LABELS[r.transactionType];
  const featuredClass = r.featured ? " card-gold" : "";
  const fullWidthStyle = r.featured ? ' style="grid-column:1/-1"' : "";
  return `
        <article class="card${featuredClass} quote-card"${fullWidthStyle}>
          <div class="mark" aria-hidden="true">&ldquo;</div>
          <blockquote><p>${escapeHtml(r.quoteText)}</p></blockquote>
          <div class="author">
            <span class="author-name">${escapeHtml(r.preferredCredit || "")}</span>
            ${badge ? `<span class="badge badge-gold">${badge}</span>` : ""}
          </div>
        </article>`;
}

function renderFeaturedStack(featuredReviews, isRussian) {
  // Sort ascending by quoteText.length so shorter quotes render on top —
  // smoother visual entry (lighter top, weightier bottom) and the longer
  // quote feels earned rather than imposed at the section start.
  const sorted = [...featuredReviews].sort((a, b) => a.quoteText.length - b.quoteText.length);
  const headline = isRussian ? "Что говорят клиенты" : "What clients say";
  const ctaText = isRussian ? "Все истории клиентов →" : "Read more client stories →";
  const cards = sorted.map(r => {
    const badge = TRANSACTION_LABELS[r.transactionType];
    return `
        <article class="featured-stack-card">
          <div class="mark" aria-hidden="true">&ldquo;</div>
          <blockquote>${escapeHtml(r.quoteText)}</blockquote>
          <div class="author">
            <span class="author-name">${escapeHtml(r.preferredCredit || "")}</span>
            ${badge ? `<span class="badge badge-gold">${badge}</span>` : ""}
          </div>
        </article>`;
  }).join("");
  return `
  <section class="featured-reviews section section-light" aria-label="${headline}">
    <div class="container">
      <h2 class="center">${headline}</h2>
      <div class="divider center"></div>
      <div class="featured-stack">${cards}
      </div>
      <a class="featured-stack-cta" href="/testimonials">${ctaText}</a>
    </div>
  </section>`;
}

// At build time, fetch published reviews from the dashboard-v2 public endpoint.
// Throws on any failure -> fails the build loudly (no silent empty /testimonials).
async function fetchPublishedReviews() {
  const url = "https://alex-sverdlik-dashboard-v2.netlify.app/.netlify/functions/reviews-public-list";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`reviews-public-list returned HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data['reviews'])) throw new Error("reviews-public-list returned unexpected shape (expected {reviews: [...]})");
  return data['reviews'];
}

// ===== PAGES =====

async function main() {
const reviews = await fetchPublishedReviews();
const featuredReviews = reviews.filter(r => r.featured);
if (featuredReviews.length === 0) {
  throw new Error("No featured reviews — refusing to ship empty homepage carousel");
}

const PAGES = [];

// --- HOMEPAGE ---
PAGES.push(page({
  title: "Alex Sverdlik | Luxury Real Estate in Parkland & Southeast Florida",
  description: "Luxury homes, waterfront estates, and smart real estate investments in Parkland, Boca Raton, and Southeast Florida. Bilingual English/Russian broker with 20+ years experience, finance background, and top producer track record.",
  path: "/",
  body: `
  <section class="hero">
    <div class="hero-content">
      <p class="hero-tag">Parkland · Boca Raton · Fort Lauderdale · Waterfront</p>
      <h1>Your Guide to Luxury Living<br><em>in Southeast Florida</em></h1>
      <p class="hero-sub">Luxury homes, waterfront estates, and smart investments — guided by 20 years of expertise and a finance-first approach.</p>
      <div class="hero-btns">
        <a href="/contact" class="btn btn-gold">Discover Your Next Home</a>
        <a href="/ru" class="btn btn-outline">По-русски</a>
      </div>
      <div class="paths">
        <a href="/relocating-northeast" class="path-card"><span class="gold">✦</span> Relocating from the Northeast</a>
        <a href="/waterfront" class="path-card"><span class="gold">◆</span> Waterfront &amp; Luxury</a>
        <a href="/investment" class="path-card"><span class="gold">●</span> Investment Properties</a>
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container center">
      <h2>Why Work with Alex?</h2>
      <p class="subtitle center">Smith Barney finance veteran. Silicon Valley startup pioneer. Top-producing California realtor. Now Southeast Florida's most qualified luxury broker.</p>
      <div class="divider center"></div>
      <div class="grid grid-3" style="margin-top:48px;text-align:left">
        <div class="card">
          <h4 style="color:var(--navy);margin-bottom:10px">Finance-First Approach</h4>
          <p>From Smith Barney to Shipwire.com to real estate — Alex speaks the language of returns, tax strategy, and portfolio growth.</p>
        </div>
        <div class="card">
          <h4 style="color:var(--navy);margin-bottom:10px">He Made the Move Too</h4>
          <p>NYC roots, Silicon Valley career, LA real estate success, now raising his family in Parkland. He's lived every relocation path his clients take.</p>
        </div>
        <div class="card">
          <h4 style="color:var(--navy);margin-bottom:10px">Bilingual &amp; International</h4>
          <p>Fluent in Russian and English. Experienced with international buyers, foreign investment structures, and cross-border transactions.</p>
        </div>
      </div>
      <div style="margin-top:40px">
        <a href="/about" class="btn btn-gold">Meet Alex</a>
      </div>
    </div>
  </section>

  ${renderFeaturedStack(featuredReviews, false)}

  ${ctaBlock("Ready to Explore Southeast Florida?", "Whether you're relocating, investing, or upgrading — let's find the right property together.")}
  `
}));

// --- ABOUT ---
PAGES.push(page({
  title: "About Alex Sverdlik | Luxury Realtor Parkland FL | Broker Associate",
  description: "Meet Alex Sverdlik — broker associate at ZenQuest Realty with 20+ years experience. Finance background (Smith Barney), Silicon Valley startup veteran (Shipwire.com), top Zip Realty producer in LA. Bilingual English/Russian. Serving Parkland, Boca Raton, and SE Florida.",
  path: "/about",
  body: `
  <section class="section section-light" style="padding-top:140px">
    <div class="container">
      <h2 class="center">Meet Alex Sverdlik</h2>
      <div class="divider center"></div>
      <div class="grid grid-about" style="margin-top:48px">
        <div>
          <div class="about-photo">
            <div style="z-index:1">
              <div class="initials">AS</div>
              <div class="label">Broker Associate</div>
              <div class="label" style="margin-top:3px">ZenQuest Realty</div>
            </div>
          </div>
          <p style="text-align:center;margin-top:14px;font-size:14px;color:var(--slate)">📞 ${PHONE}</p>
        </div>
        <div>
          <p>From Wall Street to Silicon Valley to waterfront — Alex brings two decades of real estate expertise backed by a finance career at Smith Barney, five years as an early team member at tech startup Shipwire.com in Silicon Valley, and a track record as a top producer at Zip Realty in the La Cañada Flintridge and greater Los Angeles market.</p>
          <p style="margin-top:18px">After living in Marin County and La Cañada Flintridge, Alex relocated his family to Parkland. Two of his daughters attended Pinecrest Academy here and went on to the University of Michigan Ross School of Business and pre-med at the University of Florida. His eldest, who attended high school in La Cañada, graduated from Princeton University.</p>
          <p style="margin-top:18px">His wife, Dr. Naomi Schechter, is a practicing radiation oncologist in Delray Beach. Together, they've built a life in Parkland that reflects everything their clients are searching for — top-tier education, community, and quality of life.</p>
          <p style="margin-top:18px">Licensed Broker Associate with ZenQuest Realty, Alex speaks fluent Russian and English. He specializes in luxury properties from $1M to $10M+, serving relocating families from the Northeast and California, international buyers, and investors across Southeast Florida.</p>
          <div class="grid grid-2 cred-grid" style="margin-top:32px">
            <div class="cred">20+ Years Experience</div>
            <div class="cred">Broker Licensed</div>
            <div class="cred">Top 8% — Peer Reputation</div>
            <div class="cred">Bilingual: English &amp; Russian</div>
            <div class="cred">Smith Barney · Shipwire.com</div>
            <div class="cred">Top Producer — Zip Realty</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ${ctaBlock("Let's Talk About Your Goals", "Whether buying, selling, or investing — Alex brings a level of expertise most agents simply can't match.")}
  `
}));

// --- RELOCATING NORTHEAST ---
PAGES.push(page({
  title: "Relocating from New York to Parkland FL | Northeast to Florida Guide",
  description: "Moving from New York, New Jersey, or Connecticut to Parkland, Florida? Alex Sverdlik helps Northeast families relocate to Southeast Florida with expert guidance on schools, communities, taxes, and luxury homes $1M+.",
  path: "/relocating-northeast",
  schema: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Relocating from the Northeast to Parkland, Florida",
    "author": { "@type": "Person", "name": "Alex Sverdlik" },
    "publisher": { "@type": "Organization", "name": "Alex Sverdlik Real Estate" },
    "description": "Complete guide for families moving from NYC, NJ, CT to Parkland FL"
  }),
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center">
      <h1 class="cream">Relocating from the Northeast?</h1>
      <p class="subtitle-dark center" style="max-width:600px">You don't have to choose between opportunity and sunshine. Alex made the move himself — and has helped dozens of families do the same.</p>
      <div class="divider center"></div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="grid grid-2">
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">More Space, Less Tax</h3>
          <p>No state income tax in Florida. Your equity from Westchester, Teaneck, or the Five Towns goes dramatically further in Parkland. A $1.5M budget here buys what $3M+ gets you in the tri-state area.</p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Schools That Deliver</h3>
          <p>Alex's own daughters went from Pinecrest Academy to Michigan Ross and UF pre-med. The educational pipeline here produces results that rival any Northeast corridor.</p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Your Community Awaits</h3>
          <p>Synagogues within walking distance, kosher dining, eruv, Jewish day schools — your way of life continues here, with space and sunshine. <a href="/community" style="color:var(--gold);font-weight:600">Learn more →</a></p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">The Food Is Actually Good</h3>
          <p>Real bagels, great pizza, incredible pastries. Alex has the New Yorker's honest guide to eating well in SE Florida. <a href="/lifestyle" style="color:var(--gold);font-weight:600">See the guide →</a></p>
        </div>
      </div>
    </div>
  </section>
  ${ctaBlock("Get the Free Relocation Guide", "Everything a Northeast family needs to know about making the move to Parkland and Southeast Florida.")}
  `
}));

// --- RELOCATING CALIFORNIA ---
PAGES.push(page({
  title: "Relocating from California to Florida | Silicon Valley to Parkland FL",
  description: "Moving from California or Silicon Valley to Florida? Alex Sverdlik lived in Marin County, worked at Shipwire.com, and sold luxury homes in La Cañada Flintridge. He's made the CA-to-FL move himself.",
  path: "/relocating-california",
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center">
      <h1 class="cream">Relocating from California?</h1>
      <p class="subtitle-dark center" style="max-width:600px">Alex lived in Marin, worked in Silicon Valley, and sold luxury homes in La Cañada. He's made the California-to-Florida move firsthand.</p>
      <div class="divider center"></div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <div class="grid grid-2">
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Tax Savings That Add Up</h3>
          <p>No state income tax, no estate tax. For high-earning tech professionals and business owners, Florida's tax structure can save hundreds of thousands annually compared to California.</p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Space You Can't Get in CA</h3>
          <p>What $2M buys in Parkland — a 5,000+ sq ft estate on an acre with a pool — would cost $5M+ in Marin, Pasadena, or the Westside. Your dollar goes dramatically further.</p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Alex Knows Both Markets</h3>
          <p>As a top Zip Realty producer in La Cañada Flintridge and the greater LA market, Alex understands exactly what you're leaving — and what you're gaining.</p>
        </div>
        <div class="card">
          <h3 style="color:var(--navy);margin-bottom:12px">Silicon Valley to Sunshine</h3>
          <p>As an early team member at Shipwire.com in Silicon Valley, Alex understands the tech mindset, the pace, and what it means to finally trade it for waterfront living.</p>
        </div>
      </div>
    </div>
  </section>
  ${ctaBlock("Ready to Make the Move?", "Alex has lived the California-to-Florida transition. Let him guide yours.")}
  `
}));

// --- NEIGHBORHOODS ---
PAGES.push(page({
  title: "Parkland FL Neighborhoods Guide | Luxury Communities & Homes",
  description: "Explore luxury neighborhoods in Parkland, Florida: Heron Bay, MiraLago, Parkland Golf & Country Club, BBB Ranches, Watercress, and more. Homes from $700K to $5M+. Expert neighborhood guide by Alex Sverdlik.",
  path: "/neighborhoods",
  body: `
  <section class="section section-light" style="padding-top:140px">
    <div class="container">
      <h1 class="center">Explore Neighborhoods</h1>
      <p class="subtitle center">From gated family communities to sprawling equestrian estates</p>
      <div class="divider center"></div>
      <div class="grid grid-2" style="margin-top:48px">
        ${[
          { name: "Heron Bay", desc: "Gated lakefront living with resort-style amenities, top-rated schools, and a championship golf course.", price: "$800K – $2.5M", type: "Lakefront" },
          { name: "MiraLago", desc: "Exclusive guard-gated community with Mediterranean architecture, waterfront lots, and private parks.", price: "$1.2M – $3.5M", type: "Waterfront" },
          { name: "Parkland Golf &amp; Country Club", desc: "Premier golf community with custom estates, 24-hour security, and world-class clubhouse.", price: "$1.5M – $5M+", type: "Golf" },
          { name: "Watercress / Fox Ridge", desc: "Family-friendly enclaves with spacious lots, excellent schools, and community pools.", price: "$700K – $1.8M", type: "Family" },
          { name: "BBB Ranches", desc: "Sprawling 2+ acre equestrian estates. No HOA. Private gated properties with barns and tennis courts.", price: "$1.5M – $5M+", type: "Equestrian" },
          { name: "Hillsboro Mile", desc: "Ultra-exclusive oceanfront enclave between the Intracoastal and Atlantic. South Florida's best-kept secret.", price: "$5M – $25M+", type: "Oceanfront" },
        ].map(n => `
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:14px;gap:12px;flex-wrap:wrap">
            <h3 style="color:var(--navy);margin:0">${n.name}</h3>
            <span class="badge badge-gold">${n.type}</span>
          </div>
          <p>${n.desc}</p>
          <div style="font-weight:600;color:var(--navy);margin-top:18px;padding-top:14px;border-top:1px solid rgba(45,49,66,.07)">${n.price}</div>
        </article>`).join("")}
      </div>
    </div>
  </section>
  ${ctaBlock("Find Your Neighborhood", "Alex will match you with the community that fits your lifestyle, budget, and priorities.")}
  `
}));

// --- WATERFRONT ---
PAGES.push(page({
  title: "Waterfront Homes Southeast Florida | Luxury Lakefront & Oceanfront",
  description: "Luxury waterfront properties in Southeast Florida from $1M to $25M+. Lakefront homes in Parkland, Intracoastal estates in Boca Raton and Lighthouse Point, oceanfront on Hillsboro Mile. Expert guidance from Alex Sverdlik.",
  path: "/waterfront",
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center">
      <h1 class="cream">Waterfront Living</h1>
      <p class="subtitle-dark center" style="max-width:600px">Lakefront. Intracoastal. Oceanfront. Southeast Florida offers every type of waterfront lifestyle — Alex specializes in properties from $1M to $10M+ across the full spectrum.</p>
      <div class="divider center"></div>
      <div class="grid grid-3" style="margin-top:48px;text-align:left">
        ${[
          { type: "Lakefront &amp; Canal", area: "Parkland · Coral Springs", range: "$1M – $3.5M", desc: "Peaceful water views, private docks, and family-friendly communities with top schools nearby." },
          { type: "Intracoastal", area: "Boca Raton · Lighthouse Point · Fort Lauderdale", range: "$2M – $8M", desc: "Deep-water access, yacht docking, and coastal living minutes from dining and culture." },
          { type: "Oceanfront", area: "Hillsboro Mile · Deerfield · Highland Beach", range: "$5M – $25M+", desc: "Direct Atlantic frontage. Private beaches. The pinnacle of Southeast Florida luxury." },
        ].map(w => `
        <div class="card card-dark" style="border-top:3px solid var(--gold)">
          <h3 class="cream" style="margin-bottom:4px">${w.type}</h3>
          <p style="font-size:12px;color:var(--gold);letter-spacing:2px;margin-bottom:14px">${w.area}</p>
          <p class="subtitle-dark" style="margin-bottom:18px">${w.desc}</p>
          <div style="font-weight:600;color:var(--cream);padding-top:14px;border-top:1px solid rgba(201,169,110,.12)">${w.range}</div>
        </div>`).join("")}
      </div>
    </div>
  </section>
  ${ctaBlock("Explore Waterfront Properties", "From lakefront family homes to $10M+ oceanfront estates — let Alex show you the possibilities.")}
  `
}));

// --- LIFESTYLE ---
PAGES.push(page({
  title: "Parkland FL Lifestyle | Best Schools, Restaurants & Things to Do",
  description: "Discover life in Parkland, Florida: top private schools (Pinecrest Academy, American Heritage), best bagels, pizza, kosher dining, parks, and family activities. A New Yorker's honest guide to Southeast Florida living.",
  path: "/lifestyle",
  body: `
  <section class="section section-light" style="padding-top:140px">
    <div class="container">
      <h1 class="center">Life in Parkland</h1>
      <p class="subtitle center">More than a home — a way of living</p>
      <div class="divider center"></div>

      <div class="card card-gold" style="margin-top:48px">
        <h3 style="color:var(--navy);margin-bottom:10px">Education Excellence</h3>
        <p>Pinecrest Academy, American Heritage, North Broward Prep — Parkland's private school landscape rivals anywhere in the country. Two of Alex's daughters attended Pinecrest and went on to the University of Michigan Ross School of Business and pre-med at the University of Florida.</p>
      </div>

      <h3 class="center" style="color:var(--navy);margin:48px 0 10px">Tastes Like Home</h3>
      <p class="subtitle center" style="margin-bottom:32px">A New Yorker's honest guide to eating well in Southeast Florida</p>
      <div class="grid grid-4">
        ${[
          { name: "Best Bagels", note: "A New Yorker's honest verdict on where to find a real bagel in SE Florida." },
          { name: "Pizza Worth the Drive", note: "Thin crust, Neapolitan, NY-style — rated by someone who grew up on the real thing." },
          { name: "Pastries &amp; Bakeries", note: "From French patisseries to kosher bakeries — the hidden gems." },
          { name: "Kosher Dining", note: "Full guide to kosher restaurants, markets, and catering in Parkland, Boca, and Coral Springs." },
        ].map(f => `
        <div class="card">
          <h4 style="color:var(--navy);margin-bottom:8px">${f.name}</h4>
          <p style="font-size:14px">${f.note}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>
  ${ctaBlock("Get the Full Lifestyle Guide", "Everything you need to know about living, eating, and thriving in Parkland and Southeast Florida.")}
  `
}));

// --- COMMUNITY ---
PAGES.push(page({
  title: "Jewish Community Parkland FL | Shul, Kosher Dining, Eruv & Schools",
  description: "Parkland, Florida's Jewish community guide: synagogues within walking distance, eruv coverage, kosher restaurants and grocery stores, Jewish day schools, and welcoming congregations. Perfect for families relocating from the Northeast.",
  path: "/community",
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center" style="max-width:800px">
      <h1 class="cream">Community &amp; Faith</h1>
      <p class="subtitle-dark center">Your values, your traditions, with space and sunshine</p>
      <div class="divider center"></div>
      <p class="subtitle-dark center" style="margin:32px auto 40px;max-width:650px">For families who keep Shabbat, maintain kosher homes, or simply want a strong Jewish community, Parkland and the surrounding area offer everything you need — without compromise.</p>

      ${["Synagogues within walking distance in key neighborhoods", "Eruv coverage in multiple communities", "Kosher restaurants, bakeries, and grocery stores in Parkland, Boca, and Coral Springs", "Jewish day schools and youth programs", "Active and welcoming congregations across all denominations"].map(f => `
      <div class="feature-row">
        <span class="star">✦</span>
        <p>${f}</p>
      </div>`).join("")}
    </div>
  </section>
  ${ctaBlock("Find a Home Near Your Community", "Alex will match you with neighborhoods that fit your observance level and community needs.")}
  `
}));

// --- INVESTMENT ---
PAGES.push(page({
  title: "Florida Real Estate Investment | 1031 Exchange, International Buyers",
  description: "Real estate investment in Southeast Florida with expert financial guidance. 1031 exchanges, international buyer structures, rental yield analysis, and portfolio diversification. Alex Sverdlik — Smith Barney finance background, broker licensed.",
  path: "/investment",
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center">
      <h1 class="cream">Real Estate as Investment</h1>
      <p class="subtitle-dark center" style="max-width:600px">With a Smith Barney finance background, Alex speaks the language of returns — not just bedrooms.</p>
      <div class="divider center"></div>
    </div>
  </section>
  <section class="section section-light">
    <div class="container">
      <div class="grid grid-2">
        <div class="card card-gold">
          <h3 style="color:var(--navy);margin-bottom:10px">1031 Exchanges</h3>
          <p>Time-sensitive, high-stakes, and requiring deep market knowledge. Alex has successfully guided clients through 1031 exchanges with as little as 15 days to identify replacement properties.</p>
        </div>
        <div class="card card-gold">
          <h3 style="color:var(--navy);margin-bottom:10px">International Buyers</h3>
          <p>Purchasing as a non-citizen, LLC structures, tax implications, EB-5 connections, and property management for non-residents. Fluent in Russian for seamless communication.</p>
        </div>
        <div class="card card-gold">
          <h3 style="color:var(--navy);margin-bottom:10px">Portfolio Diversification</h3>
          <p>Cap rates, appreciation trends, rental yield analysis, and comparative market data. Get advice grounded in financial expertise, not just real estate enthusiasm.</p>
        </div>
        <div class="card card-gold">
          <h3 style="color:var(--navy);margin-bottom:10px">Medical Professionals</h3>
          <p>Dr. Schechter practices in Delray Beach. Alex understands physicians relocating for positions at Cleveland Clinic Weston, Baptist Health, Boca Regional, and beyond.</p>
        </div>
      </div>
    </div>
  </section>
  ${ctaBlock("Discuss Your Investment Strategy", "Alex brings Wall Street thinking to Southeast Florida real estate.")}
  `
}));

// --- TESTIMONIALS ---
// Renders the 6 published reviews fetched at build time. Featured reviews
// (Glenn + Linda & Jay) get full-row width with gold accent border via
// .card-gold; non-featured fill the standard 2-col grid.
const reviewsBody = reviews.length === 0
  ? `
        <article class="card card-gold quote-card" style="grid-column:1/-1;text-align:center">
          <h3 style="color:var(--navy);margin-bottom:12px">Reviews coming soon</h3>
          <p>Stories from Alex's clients will appear here shortly.</p>
        </article>`
  : reviews.map(renderReviewCard).join("");

PAGES.push(page({
  title: "Client Reviews & Testimonials | Alex Sverdlik Realtor Parkland FL",
  description: "Read what clients say about working with Alex Sverdlik — luxury realtor in Parkland, Florida. Reviews from first-time buyers, waterfront sellers, investors, and relocating families.",
  path: "/testimonials",
  body: `
  <section class="section section-light" style="padding-top:140px">
    <div class="container">
      <h1 class="center">What clients say about working with Alex</h1>
      <p class="subtitle center">Many clients return for second transactions — and send their friends.</p>
      <div class="divider center"></div>
      <div class="grid grid-2" style="margin-top:48px">${reviewsBody}
      </div>
      <p class="center" style="margin-top:36px;font-size:14px;color:var(--slate)">
        See more reviews on
        <a href="https://www.zillow.com/profile/Alex%20Sverdlik" target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">Zillow</a> ·
        <a href="https://www.yelp.com/biz/alex-sverdlik-real-broker-parkland" target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">Yelp</a> ·
        <a href="https://www.fastexpert.com/agents/alex-sverdlik-55213/" target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">FastExpert</a> ·
        <a href="https://www.google.com/search?q=Alex+Sverdlik+realtor#lrd=0x825386bce42261b7:0xfc9d3afef630a38d,1" target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">Google</a>
      </p>
    </div>
  </section>
  ${ctaBlock("Ready to Write Your Own Story?", "Join the families who found their dream home with Alex.")}
  `
}));

// --- CONTACT ---
PAGES.push(page({
  title: "Contact Alex Sverdlik | Luxury Realtor Parkland FL | (626) 644-3476",
  description: "Contact Alex Sverdlik, luxury real estate broker in Parkland, Florida. Specializing in homes $1M-$10M+, waterfront properties, and relocation from the Northeast and California. Call (626) 644-3476.",
  path: "/contact",
  body: `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container" style="max-width:560px">
      <h1 class="cream center">Let's Talk</h1>
      <p class="subtitle-dark center">Tell me what you're dreaming about and I'll send you some options.</p>
      <div class="divider center"></div>
      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact-thanks" style="margin-top:40px">
        <input type="hidden" name="form-name" value="contact">
        <p style="display:none"><label>Don't fill this out if you're human: <input name="bot-field"></label></p>
        <div class="form-group"><label>Name</label><input type="text" name="name" required></div>
        <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
        <div class="form-group"><label>Phone</label><input type="tel" name="phone"></div>
        <div class="form-group"><label>What are you looking for?</label><textarea name="message" rows="4"></textarea></div>
        <div class="form-group">
          <label>Timeline</label>
          <select name="timeline">
            <option value="">Select...</option>
            <option>ASAP</option>
            <option>1–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
            <option>Just exploring</option>
          </select>
        </div>
        <button type="submit" class="btn btn-gold" style="width:100%;margin-top:12px">Send Message</button>
      </form>
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid rgba(201,169,110,0.2);text-align:center">
        <p style="font-size:12px;color:var(--wgray);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px">Or Reach Alex Directly</p>
        <p style="font-size:15px;margin:6px 0">
          <a href="tel:+16266443476" style="color:var(--gold);text-decoration:none;font-weight:600">📞 ${PHONE}</a>
        </p>
        <p style="font-size:15px;margin:6px 0">
          <a href="mailto:${CONFIG.notifyEmail}" style="color:var(--gold);text-decoration:none;font-weight:600">✉ ${CONFIG.notifyEmail}</a>
        </p>
      </div>
    </div>
  </section>
  `
}));

// --- CONTACT THANK-YOU PAGE (where Netlify redirects after submit) ---
PAGES.push(page({
  title: "Thank You | Alex Sverdlik",
  description: "Thank you for reaching out to Alex Sverdlik. Alex will be in touch within 24 hours.",
  path: "/contact-thanks",
  body: `
  <section class="section section-grad" style="padding-top:140px;min-height:60vh">
    <div class="container" style="max-width:560px;text-align:center">
      <h1 class="cream center">Thank You</h1>
      <div class="divider center"></div>
      <p class="subtitle-dark center" style="margin-top:24px;font-size:17px;line-height:1.7">
        Your message has been received. Alex will personally review it and get back to you within 24 hours.
      </p>
      <p style="margin-top:28px;color:var(--wgray);font-size:14px">
        Need to reach him sooner?
      </p>
      <p style="margin-top:8px;font-size:16px">
        <a href="tel:+16266443476" style="color:var(--gold);text-decoration:none;font-weight:600">Call or text ${PHONE}</a>
      </p>
      <p style="margin-top:40px">
        <a href="/" class="btn btn-gold">Back to Home</a>
      </p>
    </div>
  </section>
  `
}));

// --- SEARCH HOMES (BoldTrail IDX Integration) ---
const searchAreas = [
  { name: "Parkland", range: "$700K – $5M+", tags: "Gated · Golf · Equestrian · Lakefront", icon: "🏡" },
  { name: "Boca Raton", range: "$1M – $10M+", tags: "Oceanfront · Intracoastal · Country Club", icon: "🌴" },
  { name: "Fort Lauderdale", range: "$1M – $8M+", tags: "Las Olas · Intracoastal · Waterfront", icon: "🏙️" },
  { name: "Lighthouse Point", range: "$1.5M – $6M+", tags: "Deep Water · Yacht Access · Quiet Luxury", icon: "⚓" },
  { name: "Hillsboro Mile", range: "$5M – $25M+", tags: "Oceanfront · Private Beach · Ultra-Luxury", icon: "🌊" },
  { name: "Coral Springs", range: "$500K – $2M+", tags: "Family · Schools · Community", icon: "🌳" },
];
const searchCardsHTML = searchAreas.map(a =>
  '<a href="/contact" class="card" style="display:block;text-decoration:none">' +
  '<div style="font-size:28px;margin-bottom:8px">' + a.icon + '</div>' +
  '<h3 style="color:var(--navy);margin-bottom:4px">' + a.name + '</h3>' +
  '<p style="font-size:14px;color:var(--gold);font-weight:600;margin-bottom:8px">' + a.range + '</p>' +
  '<p style="font-size:13px;color:var(--slate);margin:0">' + a.tags + '</p></a>'
).join("");

const searchBody = CONFIG.boldtrailUrl
  ? `
  <section class="section section-light" style="padding-top:100px;padding-bottom:0;min-height:100vh">
    <div style="max-width:1400px;margin:0 auto;padding:0 16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px">
        <div>
          <h1 style="font-size:clamp(24px,3vw,32px);margin-bottom:4px">Search Homes</h1>
          <p class="subtitle" style="margin:0">Browse active listings across Southeast Florida</p>
        </div>
        <a href="/contact" class="btn btn-gold" style="font-size:12px;padding:12px 24px">Work with Alex</a>
      </div>
      <iframe src="${CONFIG.boldtrailUrl}" style="width:100%;height:calc(100vh - 200px);border:none;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.06)" loading="lazy" title="Search MLS Listings"></iframe>
    </div>
  </section>`
  : `
  <section class="section section-grad" style="padding-top:140px">
    <div class="container center">
      <h1 class="cream">Search Homes</h1>
      <p class="subtitle-dark center" style="max-width:600px">Explore luxury properties across Southeast Florida. Alex will match you with homes that fit your lifestyle, budget, and priorities.</p>
      <div class="divider center"></div>
    </div>
  </section>
  <section class="section section-light">
    <div class="container">
      <h2 class="center" style="margin-bottom:8px">Browse by Area</h2>
      <p class="subtitle center" style="margin-bottom:36px">Tap any area to tell Alex what you're looking for</p>
      <div class="grid grid-3" style="text-align:left">
        ${searchCardsHTML}
      </div>
      <div style="text-align:center;margin-top:48px">
        <div class="card" style="max-width:600px;margin:0 auto;border-left:4px solid var(--gold)">
          <h3 style="color:var(--navy);margin-bottom:8px">Can't Find What You're Looking For?</h3>
          <p>Alex has access to the full MLS and often knows about properties before they hit the market. Tell him what you want and he'll do the searching for you.</p>
          <a href="/contact" class="btn btn-gold" style="margin-top:16px">Tell Alex What You Want</a>
        </div>
      </div>
    </div>
  </section>`;

PAGES.push(page({
  title: "Search Luxury Homes SE Florida | Parkland, Boca Raton, Fort Lauderdale",
  description: "Search luxury homes for sale in Parkland, Boca Raton, Fort Lauderdale, and Southeast Florida. MLS listings from $500K to $25M+. Waterfront, golf, gated communities. Alex Sverdlik, ZenQuest Realty.",
  path: "/search",
  body: searchBody,
}));

// --- RUSSIAN HOMEPAGE ---
PAGES.push(page({
  title: "Алекс Свердлик | Элитная Недвижимость Паркленд Флорида | Русскоговорящий Риелтор",
  description: "Элитные дома, недвижимость на воде и инвестиции в Юго-Восточной Флориде. Русскоговорящий брокер с 20-летним опытом. Паркленд, Бока-Ратон, Форт-Лодердейл. Звоните (626) 644-3476.",
  path: "/ru",
  body: `
  <section class="hero">
    <div class="hero-content">
      <p class="hero-tag">Паркленд · Бока-Ратон · Форт-Лодердейл · На воде</p>
      <h1 style="color:var(--cream)">Ваш Путеводитель по Роскошной Жизни<br><em style="color:var(--gold)">на Юго-Востоке Флориды</em></h1>
      <p class="hero-sub">Элитные дома, недвижимость на воде и умные инвестиции — с 20-летним опытом и финансовым подходом.</p>
      <div class="hero-btns">
        <a href="/contact" class="btn btn-gold">Найдите Свой Дом</a>
        <a href="/" class="btn btn-outline">English</a>
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container">
      <h2 class="center">Познакомьтесь с Алексом Свердликом</h2>
      <div class="divider center"></div>
      <div style="max-width:800px;margin:32px auto 0">
        <p>От Уолл-стрит через Кремниевую долину до набережной — Алекс привносит двадцатилетний опыт в недвижимости, подкреплённый карьерой в Smith Barney, пятью годами в стартапе Shipwire.com и успехами в качестве топ-продавца Zip Realty в Лос-Анджелесе.</p>
        <p style="margin-top:18px">Лицензированный брокер ZenQuest Realty. Специализация — элитная недвижимость $1M–$10M+ для семей с северо-востока, из Калифорнии, международных покупателей и инвесторов.</p>
        <p style="margin-top:18px;font-weight:600;color:var(--gold)">📞 ${PHONE}</p>
      </div>
    </div>
  </section>

  ${renderFeaturedStack(featuredReviews, true)}

  ${ctaBlock("Давайте Поговорим", "Расскажите о своей мечте, и Алекс подберёт варианты.")}
  `
}));

// ===== SITEMAP =====
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => {
  const loc = p.match(/rel="canonical" href="([^"]+)"/)?.[1] || SITE;
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${loc === SITE + "/" || loc === SITE ? "1.0" : "0.8"}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

// ===== ROBOTS.TXT =====
const robots = `User-agent: *
Allow: /
Sitemap: ${SITE}/sitemap.xml`;

// ===== NETLIFY REDIRECTS (clean URLs) =====
const redirects = PAGES.map(p => {
  const m = p.match(/rel="canonical" href="[^"]+(\/.+?)"/);
  if (m && m[1] !== "/") return `${m[1]}    ${m[1]}.html    200`;
  return null;
}).filter(Boolean).join("\n");

// ===== WRITE FILES =====
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(OUT);
ensureDir(OUT + "/ru");

const pageFiles = [
  { path: "/", file: "index.html" },
  { path: "/about", file: "about.html" },
  { path: "/relocating-northeast", file: "relocating-northeast.html" },
  { path: "/relocating-california", file: "relocating-california.html" },
  { path: "/neighborhoods", file: "neighborhoods.html" },
  { path: "/waterfront", file: "waterfront.html" },
  { path: "/lifestyle", file: "lifestyle.html" },
  { path: "/community", file: "community.html" },
  { path: "/investment", file: "investment.html" },
  { path: "/testimonials", file: "testimonials.html" },
  { path: "/contact", file: "contact.html" },
  { path: "/contact-thanks", file: "contact-thanks.html" },
  { path: "/search", file: "search.html" },
  { path: "/ru", file: "ru/index.html" },
];

PAGES.forEach((html, i) => {
  const f = pageFiles[i];
  if (f) {
    fs.writeFileSync(path.join(OUT, f.file), html);
    console.log(`✓ ${f.file}`);
  }
});

// Sitemap, robots, redirects
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);
console.log("✓ sitemap.xml");
fs.writeFileSync(path.join(OUT, "robots.txt"), robots);
console.log("✓ robots.txt");

// AI Chat Widget (separate JS file)
fs.writeFileSync(path.join(OUT, "chat.js"), buildChatJS());
console.log("✓ chat.js (AI chat widget)");

// Netlify _redirects — 301 redirects (must come first; first match wins) + clean-URL rewrites
const redirects301 = "/client-stories    /testimonials    301!\n";
const redir = redirects301 + pageFiles
  .filter(f => f.path !== "/" && f.path !== "/ru")
  .map(f => `${f.path}    /${f.file}    200`)
  .join("\n") + "\n/ru    /ru/index.html    200\n";
fs.writeFileSync(path.join(OUT, "_redirects"), redir);
console.log("✓ _redirects");

console.log(`\nDone! ${PAGES.length} pages built in ${OUT}`);

}

main().catch(err => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
