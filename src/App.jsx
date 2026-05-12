import { useState, useRef, useEffect } from "react";

const CONTACTS = [
  { id: "ai", name: "Pawa AI", location: "Your smart money assistant", avatar: "AI", online: true, lastMsg: "How can I help you today?", time: "now", unread: 1, isAI: true },
  { id: 1, name: "Amara Diallo", location: "Lagos, NG", avatar: "AD", online: true, lastMsg: "Send me the money now", time: "2m", unread: 2 },
  { id: 2, name: "Priya Sharma", location: "Mumbai, IN", avatar: "PS", online: true, lastMsg: "Did you receive it?", time: "14m", unread: 0 },
  { id: 3, name: "Chen Wei", location: "Manila, PH", avatar: "CW", online: false, lastMsg: "Thanks for the payment", time: "1h", unread: 0 },
  { id: 4, name: "Fatima Al-Hassan", location: "Nairobi, KE", avatar: "FA", online: true, lastMsg: "Can you split the bill?", time: "3h", unread: 1 },
  { id: 5, name: "Kwame Asante", location: "Accra, GH", avatar: "KA", online: false, lastMsg: "Got it, thanks!", time: "1d", unread: 0 },
];

const INITIAL_MESSAGES = {
  ai: [
    { id: 1, from: "them", text: "Hey! I'm Pawa AI, your smart money assistant. I can help you send money, check exchange rates, track your spending, and answer any questions about Pawa. What can I do for you?", time: "now", type: "text" },
  ],
  1: [
    { id: 1, from: "them", text: "Hey! Can you send me the 50 USDC you owe me from last week?", time: "10:30 AM", type: "text" },
    { id: 2, from: "me", text: "Of course, sending now", time: "10:31 AM", type: "text" },
    { id: 3, from: "me", amount: "50", currency: "USDC", time: "10:31 AM", type: "payment", status: "sent" },
    { id: 4, from: "them", text: "Send me the money now", time: "10:45 AM", type: "text" },
  ],
  2: [
    { id: 1, from: "them", text: "I just sent you 120 USDC for the project", time: "9:00 AM", type: "text" },
    { id: 2, from: "them", amount: "120", currency: "USDC", time: "9:01 AM", type: "payment", status: "received" },
    { id: 3, from: "me", text: "Did you receive it?", time: "9:15 AM", type: "text" },
  ],
  3: [
    { id: 1, from: "me", amount: "30", currency: "USDC", time: "Yesterday", type: "payment", status: "sent" },
    { id: 2, from: "them", text: "Thanks for the payment", time: "Yesterday", type: "text" },
  ],
  4: [{ id: 1, from: "them", text: "Can you split the bill? It was $80 total", time: "8:00 AM", type: "text" }],
  5: [
    { id: 1, from: "me", amount: "200", currency: "USDC", time: "Yesterday", type: "payment", status: "sent" },
    { id: 2, from: "them", text: "Got it, thanks!", time: "Yesterday", type: "text" },
  ],
};

const WALLET = { balance: "1,240.50", currency: "USDC", address: "0x7f3...4a2b" };

// Smart response engine - no API key needed
function getSmartReply(text) {
  const t = text.toLowerCase();

  if (t.match(/hi|hello|hey|sup|yo|good/)) {
    const greetings = [
      "Hey! Good to hear from you. What can I help you with today?",
      "Hi there! Need help sending money or checking your balance?",
      "Hey! I'm here. Ask me anything about your Pawa wallet."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (t.match(/balance|how much|wallet/)) {
    return "Your current balance is 1,240.50 USDC on Base network. That's roughly $1,240 USD. You're looking good!";
  }

  if (t.match(/naira|nigeria|ngn|ngo/)) {
    return "Right now 1 USDC = approximately 1,580 Nigerian Naira. So if you want to send someone ₦50,000 that's about 31.6 USDC. Way cheaper than a bank transfer.";
  }

  if (t.match(/ghana|cedi|ghc/)) {
    return "1 USDC = approximately 15.2 Ghanaian Cedi right now. Sending to Kwame in Accra? Just tap his name and hit Send.";
  }

  if (t.match(/india|rupee|inr/)) {
    return "1 USDC = approximately 83.5 Indian Rupees right now. Priya is in Mumbai - you can send her USDC instantly and she receives it in seconds.";
  }

  if (t.match(/philippines|peso|php/)) {
    return "1 USDC = approximately 57 Philippine Pesos right now. Sending to the Philippines through Pawa costs basically nothing compared to remittance services.";
  }

  if (t.match(/kenya|shilling|kes/)) {
    return "1 USDC = approximately 129 Kenyan Shillings right now. Much better than M-Pesa international rates.";
  }

  if (t.match(/send|transfer|pay/)) {
    return "Sending money on Pawa is simple. Just open a chat with the person, tap the $ button, type the amount and hit Send Now. It arrives in seconds, no fees.";
  }

  if (t.match(/fee|cost|charge|how much.*cost/)) {
    return "Pawa uses USDC on Base network. Transaction fees are less than $0.01 - basically free. No hidden charges, no conversion fees eating your money.";
  }

  if (t.match(/fast|speed|how long|instant/)) {
    return "Transfers on Pawa settle in under 2 seconds on Base network. Doesn't matter if you're sending to Lagos, Mumbai or Manila - same speed.";
  }

  if (t.match(/safe|secure|trust/)) {
    return "Your money is held in USDC - a dollar-backed stablecoin. Your wallet is on Base network, one of the most secure blockchains built. No one can access it but you.";
  }

  if (t.match(/spent|spending|history|transaction|last/)) {
    return "Here's your recent activity: You sent 50 USDC to Amara in Lagos, received 120 USDC from Priya in Mumbai, sent 200 USDC to Kwame in Accra, and 30 USDC to Chen in Manila. Total sent this week: 280 USDC.";
  }

  if (t.match(/add|deposit|top up|load/)) {
    return "To add money to your Pawa wallet, go to the wallet screen and tap Add Money. You can fund it from a bank transfer or buy USDC directly. Takes about 2 minutes.";
  }

  if (t.match(/withdraw|cash out|take out/)) {
    return "You can withdraw from your wallet to a local bank account or mobile money like M-Pesa or MTN Mobile Money. Tap Withdraw in your wallet screen.";
  }

  if (t.match(/usdc|crypto|blockchain|base/)) {
    return "Pawa runs on USDC - it's always worth $1, no crypto volatility. It moves on Base network which is fast and nearly free. You don't need to know anything about crypto to use it.";
  }

  if (t.match(/amara/)) {
    return "Amara Diallo is in Lagos, Nigeria. You've sent her 50 USDC before. Want to send her money now? Just open her chat and tap Send $.";
  }

  if (t.match(/priya/)) {
    return "Priya Sharma is in Mumbai, India. She sent you 120 USDC earlier today. Your balance with her is looking good.";
  }

  if (t.match(/kwame/)) {
    return "Kwame Asante is in Accra, Ghana. You sent him 200 USDC yesterday. He's currently offline but money transfers go through instantly regardless.";
  }

  if (t.match(/fatima/)) {
    return "Fatima Al-Hassan is in Nairobi, Kenya. She wants to split a bill - her share would be $40. Want me to help you send that?";
  }

  if (t.match(/chen/)) {
    return "Chen Wei is in Manila, Philippines. You sent him 30 USDC yesterday and he confirmed receipt.";
  }

  if (t.match(/thank|thanks|great|awesome|nice|good job|perfect/)) {
    return "Anytime! That's what I'm here for. Anything else you need help with?";
  }

  if (t.match(/split|bill|divide/)) {
    return "For splitting a bill, just figure out each person's share and send their amount directly in the chat. For Fatima's $80 bill that's $40 each. Want me to remind you to send it?";
  }

  if (t.match(/help|what can you|what do you/)) {
    return "I can help you with: checking your balance, current exchange rates for Naira, Rupee, Peso, Cedi or Shilling, your spending history, how to send money, fees, security questions, or anything else about Pawa. What do you need?";
  }

  // Default responses for anything else
  const defaults = [
    "Good question. Pawa is built to make sending money across Africa and Asia as simple as texting. What specifically would you like to know?",
    "I can help you with exchange rates, your balance, sending money, or transaction history. What do you need?",
    "Tell me more about what you're trying to do and I'll point you in the right direction."
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

const C = {
  bg: "#0a0a0a", surface: "#111111", surface2: "#1a1a1a", border: "#222222",
  accent: "#F5A623", accentDim: "#3a2800", text: "#f0f0f0", textSub: "#666666",
  textMuted: "#444444", green: "#4ade80", red: "#f87171", purple: "#a78bfa", purpleDim: "#1e1530",
};

const s = {
  root: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#050505", fontFamily:"'DM Sans',sans-serif" },
  phone: { width:390, height:780, background:C.bg, borderRadius:40, overflow:"hidden", position:"relative", boxShadow:"0 40px 120px rgba(0,0,0,0.9),0 0 0 1px #1a1a1a" },
  screen: { width:"100%", height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" },
  splash: { width:"100%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:C.bg, position:"relative" },
  splashGlow: { position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,166,35,0.15) 0%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" },
  splashLogoText: { fontSize:64, fontWeight:800, color:C.accent, letterSpacing:-3 },
  splashTagline: { fontSize:13, color:C.textSub, letterSpacing:2, textTransform:"uppercase", marginTop:8 },
  splashDots: { display:"flex", gap:6, marginTop:48 },
  splashDot: { width:6, height:6, borderRadius:"50%", background:C.accent, animation:"pulse 1.2s ease-in-out infinite" },
  onboard: { width:"100%", height:"100%", display:"flex", flexDirection:"column", padding:"48px 28px 36px", boxSizing:"border-box" },
  onboardLogo: { fontSize:24, fontWeight:800, color:C.accent },
  onboardProgress: { display:"flex", gap:6 },
  onboardDot: { width:8, height:8, borderRadius:"50%", transition:"background 0.3s" },
  onboardContent: { flex:1, display:"flex", flexDirection:"column", justifyContent:"center" },
  onboardEmoji: { fontSize:48, marginBottom:20 },
  onboardTitle: { fontSize:28, fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:12 },
  onboardSub: { fontSize:15, color:C.textSub, lineHeight:1.6, marginBottom:32 },
  onboardInput: { background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", color:C.text, fontSize:16, outline:"none", marginBottom:16, width:"100%", boxSizing:"border-box" },
  onboardBtn: { background:C.accent, color:"#000", border:"none", borderRadius:14, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", width:"100%" },
  walletCreating: { fontSize:12, color:C.accent, textAlign:"center", marginBottom:12 },
  homeHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"52px 20px 16px" },
  homeGreeting: { fontSize:13, color:C.textSub },
  homeName: { fontSize:22, fontWeight:700, color:C.text },
  walletChip: { background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:20, padding:"8px 14px", color:C.accent, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 },
  walletChipDot: { width:6, height:6, borderRadius:"50%", background:C.accent },
  tabBar: { display:"flex", padding:"0 20px", gap:4, marginBottom:8 },
  tab: { background:"transparent", border:"none", color:C.textSub, fontSize:14, fontWeight:600, padding:"8px 16px", borderRadius:8, cursor:"pointer" },
  tabActive: { background:C.surface2, color:C.text },
  contactList: { flex:1, overflowY:"auto", padding:"0 12px" },
  contactRow: { display:"flex", alignItems:"center", gap:12, padding:"12px 8px", background:"transparent", border:"none", width:"100%", cursor:"pointer", borderRadius:12, textAlign:"left" },
  avatarWrap: { position:"relative", flexShrink:0 },
  avatar: { width:48, height:48, borderRadius:"50%", background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.accent },
  aiAvatar: { width:48, height:48, borderRadius:"50%", background:C.purpleDim, border:`1px solid ${C.purple}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.purple },
  onlineDot: { position:"absolute", bottom:2, right:2, width:10, height:10, borderRadius:"50%", background:C.green, border:`2px solid ${C.bg}` },
  aiDot: { position:"absolute", bottom:2, right:2, width:10, height:10, borderRadius:"50%", background:C.purple, border:`2px solid ${C.bg}` },
  contactInfo: { flex:1, minWidth:0 },
  contactTop: { display:"flex", justifyContent:"space-between", marginBottom:2 },
  contactName: { fontSize:15, fontWeight:600, color:C.text },
  contactTime: { fontSize:11, color:C.textSub },
  contactBottom: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  contactPreview: { fontSize:13, color:C.textSub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 },
  unreadBadge: { background:C.accent, color:"#000", borderRadius:10, padding:"2px 7px", fontSize:11, fontWeight:700 },
  aiUnreadBadge: { background:C.purple, color:"#fff", borderRadius:10, padding:"2px 7px", fontSize:11, fontWeight:700 },
  contactLocation: { fontSize:11, color:C.textMuted, marginTop:2 },
  bottomNav: { display:"flex", justifyContent:"space-around", padding:"12px 0 24px", borderTop:`1px solid ${C.border}` },
  navBtn: { background:"transparent", border:"none", fontSize:22, cursor:"pointer", padding:"8px 20px" },
  chatHeader: { display:"flex", alignItems:"center", gap:10, padding:"52px 16px 12px", borderBottom:`1px solid ${C.border}` },
  backBtn: { background:"transparent", border:"none", color:C.text, fontSize:20, cursor:"pointer", padding:"4px 8px 4px 0" },
  chatHeaderAvatar: { width:36, height:36, borderRadius:"50%", background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.accent },
  aiChatHeaderAvatar: { width:36, height:36, borderRadius:"50%", background:C.purpleDim, border:`1px solid ${C.purple}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.purple },
  chatHeaderInfo: { flex:1 },
  chatHeaderName: { fontSize:15, fontWeight:600, color:C.text },
  chatHeaderSub: { fontSize:11, color:C.textSub },
  sendMoneyBtn: { background:C.accentDim, border:`1px solid ${C.accent}44`, color:C.accent, borderRadius:8, padding:"6px 12px", fontSize:13, fontWeight:700, cursor:"pointer" },
  messageList: { flex:1, overflowY:"auto", padding:"16px 12px", display:"flex", flexDirection:"column", gap:8 },
  msgRow: { display:"flex" },
  bubble: { maxWidth:"72%", padding:"10px 14px", borderRadius:16, fontSize:14, lineHeight:1.4 },
  bubbleMe: { background:C.accent, color:"#000", borderBottomRightRadius:4 },
  bubbleThem: { background:C.surface2, color:C.text, borderBottomLeftRadius:4 },
  bubbleAI: { background:C.purpleDim, color:C.text, borderBottomLeftRadius:4, border:`1px solid ${C.purple}22` },
  msgTime: { display:"block", fontSize:10, opacity:0.6, marginTop:4, textAlign:"right" },
  typingBubble: { background:C.purpleDim, border:`1px solid ${C.purple}22`, padding:"10px 14px", borderRadius:16, borderBottomLeftRadius:4, display:"flex", gap:4, alignItems:"center" },
  typingDot: { width:6, height:6, borderRadius:"50%", background:C.purple, animation:"pulse 1.2s ease-in-out infinite" },
  paymentBubble: { padding:"14px 18px", borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:140 },
  paymentMe: { background:`linear-gradient(135deg,${C.accentDim},#2a1500)`, border:`1px solid ${C.accent}44` },
  paymentThem: { background:`linear-gradient(135deg,#0a2a0a,#0f1f0f)`, border:`1px solid ${C.green}44` },
  paymentIcon: { fontSize:20, color:C.accent },
  paymentAmount: { fontSize:22, fontWeight:800, color:C.text },
  paymentCurrency: { fontSize:13, color:C.textSub, fontWeight:400 },
  paymentLabel: { fontSize:11, color:C.textSub },
  sendOverlay: { position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", zIndex:10 },
  sendSheet: { width:"100%", background:C.surface, borderRadius:"24px 24px 0 0", padding:"28px 24px 36px", boxSizing:"border-box" },
  sendSheetTitle: { fontSize:20, fontWeight:700, color:C.text, marginBottom:4 },
  sendSheetSub: { fontSize:12, color:C.textSub, marginBottom:24 },
  sendInputWrap: { display:"flex", alignItems:"center", gap:8, marginBottom:16 },
  sendDollar: { fontSize:32, color:C.accent, fontWeight:700 },
  sendInput: { flex:1, background:"transparent", border:"none", fontSize:48, fontWeight:800, color:C.text, outline:"none", width:"100%" },
  sendQuickAmounts: { display:"flex", gap:8, marginBottom:20 },
  quickAmt: { flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 0", color:C.text, fontSize:14, fontWeight:600, cursor:"pointer" },
  confirmSendBtn: { width:"100%", background:C.accent, color:"#000", border:"none", borderRadius:14, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", marginBottom:10 },
  cancelBtn: { width:"100%", background:"transparent", border:"none", color:C.textSub, fontSize:14, cursor:"pointer", padding:"8px" },
  sendSuccessWrap: { display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 0" },
  sendSuccessIcon: { width:64, height:64, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"#000", fontWeight:700, marginBottom:12 },
  sendSuccessText: { fontSize:20, fontWeight:700, color:C.text },
  chatInputRow: { display:"flex", gap:8, padding:"10px 12px 28px", borderTop:`1px solid ${C.border}` },
  chatInput: { flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:20, padding:"10px 16px", color:C.text, fontSize:14, outline:"none" },
  sendMsgBtn: { background:C.surface2, border:`1px solid ${C.border}`, borderRadius:"50%", width:40, height:40, color:C.accent, fontSize:16, cursor:"pointer", fontWeight:700 },
  walletHeader: { display:"flex", alignItems:"center", gap:12, padding:"52px 20px 16px" },
  walletHeaderTitle: { fontSize:18, fontWeight:700, color:C.text },
  walletCard: { margin:"0 16px 20px", borderRadius:20, background:"linear-gradient(135deg,#1a0f00,#2a1800)", border:`1px solid ${C.accent}33`, padding:"24px 20px", position:"relative", overflow:"hidden" },
  walletCardGlow: { position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle,${C.accent}22 0%,transparent 70%)` },
  walletCardTop: { display:"flex", justifyContent:"space-between", marginBottom:12 },
  walletCardLabel: { fontSize:12, color:C.textSub, textTransform:"uppercase", letterSpacing:1 },
  walletNetwork: { fontSize:11, color:C.accent, background:C.accentDim, borderRadius:6, padding:"2px 8px" },
  walletCardBalance: { fontSize:42, fontWeight:800, color:C.text, lineHeight:1 },
  walletCardCurrency: { fontSize:14, color:C.textSub, marginTop:4, marginBottom:12 },
  walletCardAddress: { fontSize:11, color:C.textMuted, fontFamily:"monospace" },
  walletActions: { display:"flex", gap:10, padding:"0 16px 20px" },
  walletActionBtn: { flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px", color:C.text, fontSize:14, fontWeight:600, cursor:"pointer" },
  txnHeader: { fontSize:13, fontWeight:600, color:C.textSub, textTransform:"uppercase", letterSpacing:1, padding:"0 20px 12px" },
  txnList: { flex:1, overflowY:"auto", padding:"0 16px" },
  txnRow: { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.border}` },
  txnFlag: { fontSize:24 },
  txnInfo: { flex:1 },
  txnName: { fontSize:14, fontWeight:600, color:C.text },
  txnTime: { fontSize:12, color:C.textSub },
  txnAmount: { fontSize:15, fontWeight:700 },
};

function Splash() {
  return (
    <div style={s.root}><div style={s.phone}><div style={s.splash}>
      <div style={s.splashGlow}/>
      <div style={{textAlign:"center",zIndex:1}}>
        <div style={s.splashLogoText}>pawa</div>
        <div style={s.splashTagline}>money moves like a message</div>
      </div>
      <div style={s.splashDots}>
        {[0,0.2,0.4].map((d,i)=><span key={i} style={{...s.splashDot,animationDelay:`${d}s`}}/>)}
      </div>
    </div></div></div>
  );
}

function Onboard({onDone}) {
  const [step,setStep]=useState(0);
  const [phone,setPhone]=useState("");
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const next=()=>{
    if(step===1){setLoading(true);setTimeout(()=>{setLoading(false);setStep(2);},1500);}
    else if(step===2){setLoading(true);setTimeout(()=>{setLoading(false);onDone();},1800);}
    else setStep(sv=>sv+1);
  };
  return (
    <div style={s.root}><div style={s.phone}><div style={s.onboard}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:48}}>
        <div style={s.onboardLogo}>pawa</div>
        <div style={s.onboardProgress}>{[0,1,2].map(i=><div key={i} style={{...s.onboardDot,background:i<=step?"#F5A623":"#2a2a2a"}}/>)}</div>
      </div>
      <div style={s.onboardContent}>
        {step===0&&<><div style={s.onboardEmoji}>👋</div><div style={s.onboardTitle}>Chat. Send. Done.</div><div style={s.onboardSub}>Send money across Africa and Asia as easily as sending a message. No bank. No wait. No fees that eat your money.</div><button style={s.onboardBtn} onClick={next}>Get Started</button></>}
        {step===1&&<><div style={s.onboardEmoji}>📱</div><div style={s.onboardTitle}>Your number is your wallet</div><div style={s.onboardSub}>No seed phrases. No confusing addresses. Just your phone number.</div><input style={s.onboardInput} placeholder="+234 or +91 or +63..." value={phone} onChange={e=>setPhone(e.target.value)}/><button style={{...s.onboardBtn,opacity:loading?0.6:1}} onClick={next}>{loading?"Creating your wallet...":"Continue"}</button></>}
        {step===2&&<><div style={s.onboardEmoji}>🔐</div><div style={s.onboardTitle}>Enter your code</div><div style={s.onboardSub}>We sent a 6-digit code to your number. Your wallet is being set up in the background.</div><input style={s.onboardInput} placeholder="000000" value={code} maxLength={6} onChange={e=>setCode(e.target.value)}/>{loading&&<div style={s.walletCreating}>Setting up your wallet on Base network...</div>}<button style={{...s.onboardBtn,opacity:loading?0.6:1}} onClick={next}>{loading?"Almost there...":"Verify"}</button></>}
      </div>
    </div></div></div>
  );
}

function HomeScreen({contacts,messages,tab,setTab,onContact,onWallet,wallet}) {
  return (
    <div style={s.screen}>
      <div style={s.homeHeader}>
        <div><div style={s.homeGreeting}>Good morning</div><div style={s.homeName}>Your Pawa</div></div>
        <button style={s.walletChip} onClick={onWallet}><span style={s.walletChipDot}/>{wallet.balance} USDC</button>
      </div>
      <div style={s.tabBar}>{["chats","contacts"].map(t=><button key={t} style={{...s.tab,...(tab===t?s.tabActive:{})}} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div>
      <div style={s.contactList}>
        {contacts.map(c=>{
          const msgs=messages[c.id]||[];const last=msgs[msgs.length-1];
          const preview=last?.type==="payment"?`Sent ${last.amount} USDC`:(last?.text||c.lastMsg);
          return (
            <button key={c.id} style={s.contactRow} onClick={()=>onContact(c)}>
              <div style={s.avatarWrap}>
                <div style={c.isAI?s.aiAvatar:s.avatar}>{c.avatar}</div>
                <div style={c.isAI?s.aiDot:s.onlineDot}/>
              </div>
              <div style={s.contactInfo}>
                <div style={s.contactTop}><span style={s.contactName}>{c.name}</span><span style={s.contactTime}>{c.time}</span></div>
                <div style={s.contactBottom}><span style={s.contactPreview}>{preview}</span>{c.unread>0&&<span style={c.isAI?s.aiUnreadBadge:s.unreadBadge}>{c.unread}</span>}</div>
                <div style={s.contactLocation}>{c.location}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={s.bottomNav}><button style={s.navBtn}>💬</button><button style={s.navBtn} onClick={onWallet}>👛</button><button style={s.navBtn}>⚙️</button></div>
    </div>
  );
}

function ChatScreen({contact,messages,onBack,inputText,setInputText,sendMessage,showSend,setShowSend,sendAmount,setSendAmount,sendPayment,sendSuccess,messagesEnd,isTyping}) {
  return (
    <div style={s.screen}>
      <div style={s.chatHeader}>
        <button style={s.backBtn} onClick={onBack}>←</button>
        <div style={contact.isAI?s.aiChatHeaderAvatar:s.chatHeaderAvatar}>{contact.avatar}</div>
        <div style={s.chatHeaderInfo}><div style={s.chatHeaderName}>{contact.name}</div><div style={s.chatHeaderSub}>{contact.location}{contact.online&&!contact.isAI?" · online":contact.isAI?" · AI powered":""}</div></div>
        {!contact.isAI&&<button style={s.sendMoneyBtn} onClick={()=>setShowSend(true)}>Send $</button>}
      </div>
      <div style={s.messageList}>
        {messages.map(msg=>(
          <div key={msg.id} style={{...s.msgRow,justifyContent:msg.from==="me"?"flex-end":"flex-start"}}>
            {msg.type==="text"&&<div style={{...s.bubble,...(msg.from==="me"?s.bubbleMe:contact.isAI?s.bubbleAI:s.bubbleThem)}}>{msg.text}<span style={s.msgTime}>{msg.time}</span></div>}
            {msg.type==="payment"&&<div style={{...s.paymentBubble,...(msg.from==="me"?s.paymentMe:s.paymentThem)}}><div style={s.paymentIcon}>{msg.from==="me"?"↑":"↓"}</div><div style={s.paymentAmount}>{msg.amount} <span style={s.paymentCurrency}>{msg.currency}</span></div><div style={s.paymentLabel}>{msg.from==="me"?"Sent":"Received"} · {msg.time}</div></div>}
          </div>
        ))}
        {isTyping&&<div style={{...s.msgRow,justifyContent:"flex-start"}}><div style={s.typingBubble}>{[0,0.2,0.4].map((d,i)=><span key={i} style={{...s.typingDot,animationDelay:`${d}s`}}/>)}</div></div>}
        <div ref={messagesEnd}/>
      </div>
      {showSend&&(
        <div style={s.sendOverlay}><div style={s.sendSheet}>
          {sendSuccess?(<div style={s.sendSuccessWrap}><div style={s.sendSuccessIcon}>✓</div><div style={s.sendSuccessText}>Sent!</div></div>):(<>
            <div style={s.sendSheetTitle}>Send to {contact.name.split(" ")[0]}</div>
            <div style={s.sendSheetSub}>Instant · No fees · USDC on Base</div>
            <div style={s.sendInputWrap}><span style={s.sendDollar}>$</span><input style={s.sendInput} type="number" placeholder="0" value={sendAmount} onChange={e=>setSendAmount(e.target.value)} autoFocus/></div>
            <div style={s.sendQuickAmounts}>{["10","25","50","100"].map(a=><button key={a} style={s.quickAmt} onClick={()=>setSendAmount(a)}>${a}</button>)}</div>
            <button style={s.confirmSendBtn} onClick={sendPayment}>Send Now</button>
            <button style={s.cancelBtn} onClick={()=>setShowSend(false)}>Cancel</button>
          </>)}
        </div></div>
      )}
      <div style={s.chatInputRow}>
        <input style={s.chatInput} placeholder="Message..." value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/>
        {!contact.isAI&&<button style={s.sendMsgBtn} onClick={()=>setShowSend(true)}>$</button>}
        <button style={s.sendMsgBtn} onClick={sendMessage}>→</button>
      </div>
    </div>
  );
}

function WalletScreen({wallet,onBack}) {
  const txns=[
    {id:1,name:"Amara Diallo",type:"sent",amount:"-50 USDC",time:"Today, 10:31 AM",flag:"🇳🇬"},
    {id:2,name:"Priya Sharma",type:"received",amount:"+120 USDC",time:"Today, 9:01 AM",flag:"🇮🇳"},
    {id:3,name:"Kwame Asante",type:"sent",amount:"-200 USDC",time:"Yesterday",flag:"🇬🇭"},
    {id:4,name:"Chen Wei",type:"sent",amount:"-30 USDC",time:"Yesterday",flag:"🇵🇭"},
  ];
  return (
    <div style={s.screen}>
      <div style={s.walletHeader}><button style={s.backBtn} onClick={onBack}>←</button><div style={s.walletHeaderTitle}>My Wallet</div></div>
      <div style={s.walletCard}>
        <div style={s.walletCardGlow}/>
        <div style={s.walletCardTop}><span style={s.walletCardLabel}>Total Balance</span><span style={s.walletNetwork}>Base Network</span></div>
        <div style={s.walletCardBalance}>{wallet.balance}</div>
        <div style={s.walletCardCurrency}>USDC</div>
        <div style={s.walletCardAddress}>{wallet.address}</div>
      </div>
      <div style={s.walletActions}><button style={s.walletActionBtn}>Add Money</button><button style={s.walletActionBtn}>Withdraw</button></div>
      <div style={s.txnHeader}>Recent Transactions</div>
      <div style={s.txnList}>{txns.map(t=><div key={t.id} style={s.txnRow}><div style={s.txnFlag}>{t.flag}</div><div style={s.txnInfo}><div style={s.txnName}>{t.name}</div><div style={s.txnTime}>{t.time}</div></div><div style={{...s.txnAmount,color:t.type==="received"?C.green:C.red}}>{t.amount}</div></div>)}</div>
    </div>
  );
}

export default function App() {
  const [view,setView]=useState("splash");
  const [activeContact,setActiveContact]=useState(null);
  const [messages,setMessages]=useState(INITIAL_MESSAGES);
  const [inputText,setInputText]=useState("");
  const [showSend,setShowSend]=useState(false);
  const [sendAmount,setSendAmount]=useState("");
  const [sendSuccess,setSendSuccess]=useState(false);
  const [walletView,setWalletView]=useState(false);
  const [tab,setTab]=useState("chats");
  const [isTyping,setIsTyping]=useState(false);
  const messagesEnd=useRef(null);

  useEffect(()=>{if(view==="splash")setTimeout(()=>setView("onboard"),2200);},[]);
  useEffect(()=>{messagesEnd.current?.scrollIntoView({behavior:"smooth"});},[messages,activeContact,isTyping]);

  const sendMessage=()=>{
    if(!inputText.trim())return;
    const text=inputText;
    const newMsg={id:Date.now(),from:"me",text,time:"Now",type:"text"};
    setMessages(prev=>({...prev,[activeContact.id]:[...(prev[activeContact.id]||[]),newMsg]}));
    setInputText("");

    if(activeContact.isAI){
      setIsTyping(true);
      const delay=800+Math.random()*800;
      setTimeout(()=>{
        const reply=getSmartReply(text);
        setIsTyping(false);
        setMessages(prev=>({...prev,[activeContact.id]:[...prev[activeContact.id],{id:Date.now()+1,from:"them",text:reply,time:"Now",type:"text"}]}));
      },delay);
    }
  };

  const sendPayment=()=>{
    if(!sendAmount)return;
    setMessages(prev=>({...prev,[activeContact.id]:[...(prev[activeContact.id]||[]),{id:Date.now(),from:"me",amount:sendAmount,currency:"USDC",time:"Now",type:"payment",status:"sent"}]}));
    setSendSuccess(true);
    setTimeout(()=>{setSendSuccess(false);setShowSend(false);setSendAmount("");},2000);
  };

  if(view==="splash")return <><Splash/><style>{css}</style></>;
  if(view==="onboard")return <><Onboard onDone={()=>setView("app")}/><style>{css}</style></>;

  return (
    <>
      <style>{css}</style>
      <div style={s.root}><div style={s.phone}>
        {!activeContact&&!walletView&&<HomeScreen contacts={CONTACTS} messages={messages} tab={tab} setTab={setTab} onContact={setActiveContact} onWallet={()=>setWalletView(true)} wallet={WALLET}/>}
        {activeContact&&!walletView&&<ChatScreen contact={activeContact} messages={messages[activeContact.id]||[]} onBack={()=>setActiveContact(null)} inputText={inputText} setInputText={setInputText} sendMessage={sendMessage} showSend={showSend} setShowSend={setShowSend} sendAmount={sendAmount} setSendAmount={setSendAmount} sendPayment={sendPayment} sendSuccess={sendSuccess} messagesEnd={messagesEnd} isTyping={isTyping}/>}
        {walletView&&<WalletScreen wallet={WALLET} onBack={()=>setWalletView(false)}/>}
      </div></div>
    </>
  );
}

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');*{-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{display:none}@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`;
