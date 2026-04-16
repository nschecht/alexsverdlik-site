import { useState, useEffect, useRef } from "react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║                                                                ║
// ║   ⚡⚡⚡  FILL IN THESE THINGS  ⚡⚡⚡                          ║
// ║                                                                ║
// ║   This file is for PREVIEWING the chat widget in Claude.       ║
// ║   The real chat is already built into the public site.         ║
// ║   If you change Alex's phone, update it here too.              ║
// ║                                                                ║
// ╚══════════════════════════════════════════════════════════════════╝

const CONFIG = {
  // 1. ALEX'S PHONE (same as build-site.js)
  phone: "(626) 644-3476",

  // 2. PHONE WITHOUT FORMATTING (for tap-to-call links)
  //    Just the digits, no spaces or dashes
  phoneTel: "6266443476",

  // 3. GREETING (what visitors see when they open the chat)
  greeting: "Hi! I'm Alex's assistant. Whether you're curious about Parkland, exploring waterfront homes, or thinking about relocating — I'm here to help. What's on your mind?",

  // 4. QUICK-TAP BUTTONS (shown to first-time visitors)
  quickPrompts: [
    "Tell me about Parkland",
    "Waterfront homes",
    "Moving from NYC",
    "Schools info",
    "Говорите по-русски?",
  ],
};

// -------- STOP HERE — don't change anything below --------

// ╔════════════════════════════════════════════════════════════╗
// ║  ⚡ AI KNOWLEDGE BASE — Update if Alex's info changes ⚡   ║
// ║  This is what the AI knows about Alex and can tell visitors║
// ╚════════════════════════════════════════════════════════════╝

const C = {gold:"#c9a96e",goldL:"#e0c98f",navy:"#1a1f2e",cream:"#f5f0e8",char:"#2d3142",slate:"#6b7394",white:"#fff",grn:"#4ecb71"};

const SYS = `You are Alex Sverdlik's AI assistant on his luxury real estate website. Help visitors learn about SE Florida real estate, Parkland, and Alex's services.

ABOUT ALEX: Broker Associate, ZenQuest Realty, Coral Springs FL. 20+ years experience. Smith Barney → Shipwire.com (Silicon Valley) → top Zip Realty producer La Cañada/LA → Parkland. Fluent English/Russian. Wife Dr. Naomi Schechter, radiation oncologist Delray Beach. Daughters: Pinecrest → Michigan Ross, UF premed. Eldest → Princeton. Phone: ${CONFIG.phone}.

AREAS: Parkland, Boca Raton, Coral Springs, Fort Lauderdale, Lighthouse Point, Hillsboro Mile, Deerfield Beach, Highland Beach.

SPECIALTIES: Luxury $1M-$10M+, waterfront (lakefront/Intracoastal/ocean), NE and CA relocators, Russian-speaking buyers, international investors, 1031 exchanges, medical professionals.

NEIGHBORHOODS: Heron Bay (lakefront, $800K-$2.5M), MiraLago (waterfront, $1.2M-$3.5M), Parkland Golf & CC ($1.5M-$5M+), Watercress/Fox Ridge (family, $700K-$1.8M), BBB Ranches (equestrian 2+ acres, $1.5M-$5M+), Hillsboro Mile (oceanfront, $5M-$25M+).

COMMUNITY: Walking-distance synagogues, eruv, kosher restaurants/bakeries in Parkland/Boca/Coral Springs, Jewish day schools.

SCHOOLS: Pinecrest Academy, American Heritage, North Broward Prep. Alex's daughters attended Pinecrest.

LIFESTYLE: Great bagels, pizza, kosher dining, parks, equestrian, golf courses, waterfront activities.

BEHAVIOR:
- Warm, knowledgeable, never pushy. 2-4 sentences max per response.
- If they ask in Russian, respond in Russian.
- Naturally learn: name, what they want, timeline, budget. Don't interrogate.
- When qualified, suggest: "Would you like Alex to reach out? He's great at no-pressure conversations."
- Never invent specific listings. Share general price ranges.
- If unsure: "Great question — Alex would know. Want me to connect you?"

LEAD CAPTURE: When you've learned contact info (name + email or phone), add at END of message:
[LEAD:{"name":"...","email":"...","phone":"...","interest":"...","timeline":"...","budget":"...","lang":"..."}]
Only include fields you've learned. User won't see this tag.`;

export default function App() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{role:"assistant",text:CONFIG.greeting}]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leads, setLeads] = useState([]);
  const [toast, setToast] = useState("");
  const [unread, setUnread] = useState(0);
  const chatRef = useRef();
  const inRef = useRef();

  useEffect(() => { (async()=>{try{const r=await window.storage.get("chat-leads-v2");if(r?.value)setLeads(JSON.parse(r.value));}catch(e){}})(); }, []);
  const saveLeads = async(l)=>{setLeads(l);try{await window.storage.set("chat-leads-v2",JSON.stringify(l));}catch(e){}};
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[msgs]);
  useEffect(()=>{if(open){setUnread(0);setTimeout(()=>inRef.current?.focus(),100);}}, [open]);

  const send = async()=>{
    if(!input.trim()||busy)return;
    const txt=input.trim(); setInput("");
    const next=[...msgs,{role:"user",text:txt}]; setMsgs(next); setBusy(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,system:SYS,messages:next.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}))})});
      const data=await res.json();
      let text=data.content?.map(c=>c.text||"").join("")||`I'm having trouble connecting. Call Alex at ${CONFIG.phone}.`;
      const lm=text.match(/\[LEAD:(.*?)\]/);
      if(lm){try{const lead={...JSON.parse(lm[1]),id:Date.now(),date:new Date().toISOString(),source:"AI Chat"};await saveLeads([...leads,lead]);setToast("✓ Info saved — Alex will follow up!");setTimeout(()=>setToast(""),4000);}catch(e){}
        text=text.replace(/\[LEAD:.*?\]/,"").trim();}
      setMsgs([...next,{role:"assistant",text}]);
      if(!open)setUnread(u=>u+1);
    }catch(e){setMsgs([...next,{role:"assistant",text:`Sorry, I'm having trouble. Reach Alex at ${CONFIG.phone}.`}]);}
    setBusy(false);
  };

  const quickAsk=(q)=>{setInput(q);setTimeout(()=>{setInput(q);},0);};

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",position:"fixed",bottom:20,right:20,zIndex:9999}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {toast&&<div style={{position:"fixed",top:20,right:20,background:C.grn,color:C.white,padding:"10px 18px",borderRadius:8,fontWeight:600,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.2)",zIndex:10000,animation:"slideD .3s ease"}}>{toast}</div>}

      {open&&(
        <div style={{position:"fixed",bottom:88,right:20,width:"min(370px,calc(100vw - 40px))",height:"min(500px,calc(100vh - 120px))",background:C.white,borderRadius:16,boxShadow:"0 8px 40px rgba(0,0,0,.15)",display:"flex",flexDirection:"column",overflow:"hidden",animation:"scIn .2s ease"}}>
          {/* Header */}
          <div style={{background:C.navy,padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${C.gold},${C.goldL})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:C.navy}}>AS</div>
            <div style={{flex:1}}><div style={{fontWeight:600,color:C.cream,fontSize:14}}>Alex Sverdlik</div>
              <div style={{fontSize:11,color:C.gold,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.grn,display:"inline-block"}}/>Online</div></div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:C.slate,fontSize:18,cursor:"pointer"}}>✕</button>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10,background:"#f8f7f4"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fUp .3s ease"}}>
                <div style={{maxWidth:"82%",padding:"9px 13px",borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",background:m.role==="user"?C.navy:C.white,color:m.role==="user"?C.cream:C.char,fontSize:14,lineHeight:1.6,fontWeight:300,boxShadow:m.role==="user"?"none":"0 1px 3px rgba(0,0,0,.05)"}}>
                  {m.text}
                </div>
              </div>
            ))}
            {busy&&<div style={{display:"flex"}}><div style={{padding:"10px 16px",borderRadius:"14px 14px 14px 3px",background:C.white,boxShadow:"0 1px 3px rgba(0,0,0,.05)",display:"flex",gap:4}}>
              {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:C.slate,animation:`bounce .6s ${i*.15}s infinite alternate`,display:"inline-block"}}/>)}
            </div></div>}
          </div>

          {/* Quick prompts */}
          {msgs.length<=2&&<div style={{padding:"6px 14px 2px",display:"flex",gap:5,flexWrap:"wrap",background:"#f8f7f4"}}>
            {CONFIG.quickPrompts.map(q=>
              <button key={q} onClick={()=>quickAsk(q)} style={{fontSize:11,padding:"5px 10px",borderRadius:14,border:`1px solid ${C.gold}35`,background:`${C.gold}08`,color:C.gold,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>
            )}
          </div>}

          {/* Input */}
          <div style={{padding:"10px 14px",borderTop:"1px solid #eee",display:"flex",gap:8,background:C.white}}>
            <input ref={inRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask about Parkland, homes, schools..." style={{flex:1,padding:"9px 14px",borderRadius:22,border:"1px solid #e0ddd6",background:"#f8f7f4",fontFamily:"inherit",fontSize:14,color:C.char,outline:"none"}}/>
            <button onClick={send} disabled={busy||!input.trim()} style={{width:38,height:38,borderRadius:"50%",background:input.trim()?C.gold:"#e0ddd6",border:"none",cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:C.white,fontSize:16}}>↑</span>
            </button>
          </div>
          <div style={{padding:"4px 14px 6px",textAlign:"center",fontSize:10,color:C.slate}}>
            ZenQuest Realty · <a href={`tel:${CONFIG.phoneTel}`} style={{color:C.gold}}>{CONFIG.phone}</a>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button onClick={()=>setOpen(!open)} style={{width:58,height:58,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.goldL})`,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(201,169,110,.4)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s",position:"relative"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open?<span style={{color:C.navy,fontSize:22,fontWeight:300}}>✕</span>:
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.navy}}>AS</span>}
        {unread>0&&!open&&<span style={{position:"absolute",top:-3,right:-3,width:20,height:20,borderRadius:"50%",background:"#ef4444",color:C.white,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid white"}}>{unread}</span>}
      </button>

      <style>{`
        @keyframes scIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes fUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideD{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{to{transform:translateY(-4px);opacity:.4}}
      `}</style>
    </div>
  );
}
