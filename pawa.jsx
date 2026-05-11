import { useState, useRef, useEffect } from "react";

const CONTACTS = [
  { id: 1, name: "Amara Diallo", location: "Lagos, NG", avatar: "AD", online: true, balance: null, lastMsg: "Send me the money now", time: "2m", unread: 2 },
  { id: 2, name: "Priya Sharma", location: "Mumbai, IN", avatar: "PS", online: true, balance: null, lastMsg: "Did you receive it?", time: "14m", unread: 0 },
  { id: 3, name: "Chen Wei", location: "Manila, PH", avatar: "CW", online: false, balance: null, lastMsg: "Thanks for the payment", time: "1h", unread: 0 },
  { id: 4, name: "Fatima Al-Hassan", location: "Nairobi, KE", avatar: "FA", online: true, balance: null, lastMsg: "Can you split the bill?", time: "3h", unread: 1 },
  { id: 5, name: "Kwame Asante", location: "Accra, GH", avatar: "KA", online: false, balance: null, lastMsg: "Got it, thanks!", time: "1d", unread: 0 },
];

const INITIAL_MESSAGES = {
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
  4: [
    { id: 1, from: "them", text: "Can you split the bill? It was $80 total", time: "8:00 AM", type: "text" },
    { id: 2, from: "them", text: "Can you split the bill?", time: "8:00 AM", type: "text" },
  ],
  5: [
    { id: 1, from: "me", amount: "200", currency: "USDC", time: "Yesterday", type: "payment", status: "sent" },
    { id: 2, from: "them", text: "Got it, thanks!", time: "Yesterday", type: "text" },
  ],
};

const WALLET = { balance: "1,240.50", currency: "USDC", address: "0x7f3...4a2b" };

export default function Pawa() {
  const [view, setView] = useState("splash");
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [showSend, setShowSend] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [walletView, setWalletView] = useState(false);
  const [tab, setTab] = useState("chats");
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (view === "splash") {
      setTimeout(() => setView("onboard"), 2200);
    }
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = { id: Date.now(), from: "me", text: inputText, time: "Now", type: "text" };
    setMessages(prev => ({ ...prev, [activeContact.id]: [...(prev[activeContact.id] || []), newMsg] }));
    setInputText("");
  };

  const sendPayment = () => {
    if (!sendAmount) return;
    const newMsg = { id: Date.now(), from: "me", amount: sendAmount, currency: "USDC", time: "Now", type: "payment", status: "sent" };
    setMessages(prev => ({ ...prev, [activeContact.id]: [...(prev[activeContact.id] || []), newMsg] }));
    setSendSuccess(true);
    setTimeout(() => { setSendSuccess(false); setShowSend(false); setSendAmount(""); }, 2000);
  };

  if (view === "splash") return <Splash />;
  if (view === "onboard") return <Onboard onDone={() => setView("app")} />;

  return (
    <div style={styles.root}>
      <div style={styles.phone}>
        {!activeContact && !walletView && (
          <HomeScreen
            contacts={CONTACTS}
            messages={messages}
            tab={tab}
            setTab={setTab}
            onContact={(c) => setActiveContact(c)}
            onWallet={() => setWalletView(true)}
            wallet={WALLET}
          />
        )}
        {activeContact && !walletView && (
          <ChatScreen
            contact={activeContact}
            messages={messages[activeContact.id] || []}
            onBack={() => setActiveContact(null)}
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMessage}
            showSend={showSend}
            setShowSend={setShowSend}
            sendAmount={sendAmount}
            setSendAmount={setSendAmount}
            sendPayment={sendPayment}
            sendSuccess={sendSuccess}
            messagesEnd={messagesEnd}
          />
        )}
        {walletView && (
          <WalletScreen wallet={WALLET} onBack={() => setWalletView(false)} />
        )}
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div style={styles.root}>
      <div style={styles.phone}>
        <div style={styles.splash}>
          <div style={styles.splashGlow} />
          <div style={styles.splashLogo}>
            <span style={styles.splashLogoText}>pawa</span>
            <div style={styles.splashTagline}>money moves like a message</div>
          </div>
          <div style={styles.splashDots}>
            <span style={{...styles.splashDot, animationDelay: "0s"}} />
            <span style={{...styles.splashDot, animationDelay: "0.2s"}} />
            <span style={{...styles.splashDot, animationDelay: "0.4s"}} />
          </div>
        </div>
      </div>
      <style>{splashAnim}</style>
    </div>
  );
}

function Onboard({ onDone }) {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step === 1) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(2); }, 1500);
    } else if (step === 2) {
      setLoading(true);
      setTimeout(() => { setLoading(false); onDone(); }, 1800);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.phone}>
        <div style={styles.onboard}>
          <div style={styles.onboardTop}>
            <div style={styles.onboardLogo}>pawa</div>
            <div style={styles.onboardProgress}>
              {[0,1,2].map(i => (
                <div key={i} style={{...styles.onboardDot, background: i <= step ? "#F5A623" : "#2a2a2a"}} />
              ))}
            </div>
          </div>

          {step === 0 && (
            <div style={styles.onboardContent}>
              <div style={styles.onboardEmoji}>👋</div>
              <div style={styles.onboardTitle}>Chat. Send. Done.</div>
              <div style={styles.onboardSub}>Send money across Africa and Asia as easily as sending a message. No bank. No wait. No fees that eat your money.</div>
              <button style={styles.onboardBtn} onClick={next}>Get Started</button>
            </div>
          )}

          {step === 1 && (
            <div style={styles.onboardContent}>
              <div style={styles.onboardEmoji}>📱</div>
              <div style={styles.onboardTitle}>Your number is your wallet</div>
              <div style={styles.onboardSub}>No seed phrases. No confusing addresses. Just your phone number.</div>
              <input
                style={styles.onboardInput}
                placeholder="+234 or +91 or +63..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button style={{...styles.onboardBtn, opacity: loading ? 0.6 : 1}} onClick={next}>
                {loading ? "Creating your wallet..." : "Continue"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={styles.onboardContent}>
              <div style={styles.onboardEmoji}>🔐</div>
              <div style={styles.onboardTitle}>Enter your code</div>
              <div style={styles.onboardSub}>We sent a 6-digit code to your number. Your wallet is being set up in the background.</div>
              <input
                style={styles.onboardInput}
                placeholder="000000"
                value={code}
                maxLength={6}
                onChange={e => setCode(e.target.value)}
              />
              {loading && <div style={styles.walletCreating}>Setting up your wallet on Base network...</div>}
              <button style={{...styles.onboardBtn, opacity: loading ? 0.6 : 1}} onClick={next}>
                {loading ? "Almost there..." : "Verify"}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{splashAnim}</style>
    </div>
  );
}

function HomeScreen({ contacts, messages, tab, setTab, onContact, onWallet, wallet }) {
  return (
    <div style={styles.screen}>
      <div style={styles.homeHeader}>
        <div>
          <div style={styles.homeGreeting}>Good morning</div>
          <div style={styles.homeName}>Your Pawa</div>
        </div>
        <button style={styles.walletChip} onClick={onWallet}>
          <span style={styles.walletChipDot} />
          {wallet.balance} USDC
        </button>
      </div>

      <div style={styles.tabBar}>
        {["chats", "contacts"].map(t => (
          <button key={t} style={{...styles.tab, ...(tab === t ? styles.tabActive : {})}} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.contactList}>
        {contacts.map(c => {
          const msgs = messages[c.id] || [];
          const last = msgs[msgs.length - 1];
          const preview = last?.type === "payment" ? `Sent ${last.amount} USDC` : (last?.text || c.lastMsg);
          return (
            <button key={c.id} style={styles.contactRow} onClick={() => onContact(c)}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar}>{c.avatar}</div>
                {c.online && <div style={styles.onlineDot} />}
              </div>
              <div style={styles.contactInfo}>
                <div style={styles.contactTop}>
                  <span style={styles.contactName}>{c.name}</span>
                  <span style={styles.contactTime}>{c.time}</span>
                </div>
                <div style={styles.contactBottom}>
                  <span style={styles.contactPreview}>{preview}</span>
                  {c.unread > 0 && <span style={styles.unreadBadge}>{c.unread}</span>}
                </div>
                <div style={styles.contactLocation}>{c.location}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.bottomNav}>
        <button style={styles.navBtn}>💬</button>
        <button style={styles.navBtn} onClick={onWallet}>👛</button>
        <button style={styles.navBtn}>⚙️</button>
      </div>
      <style>{splashAnim}</style>
    </div>
  );
}

function ChatScreen({ contact, messages, onBack, inputText, setInputText, sendMessage, showSend, setShowSend, sendAmount, setSendAmount, sendPayment, sendSuccess, messagesEnd }) {
  return (
    <div style={styles.screen}>
      <div style={styles.chatHeader}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.chatHeaderAvatar}>{contact.avatar}</div>
        <div style={styles.chatHeaderInfo}>
          <div style={styles.chatHeaderName}>{contact.name}</div>
          <div style={styles.chatHeaderSub}>{contact.location} {contact.online ? "· online" : ""}</div>
        </div>
        <button style={styles.sendMoneyBtn} onClick={() => setShowSend(true)}>Send $</button>
      </div>

      <div style={styles.messageList}>
        {messages.map(msg => (
          <div key={msg.id} style={{...styles.msgRow, justifyContent: msg.from === "me" ? "flex-end" : "flex-start"}}>
            {msg.type === "text" && (
              <div style={{...styles.bubble, ...(msg.from === "me" ? styles.bubbleMe : styles.bubbleThem)}}>
                {msg.text}
                <span style={styles.msgTime}>{msg.time}</span>
              </div>
            )}
            {msg.type === "payment" && (
              <div style={{...styles.paymentBubble, ...(msg.from === "me" ? styles.paymentMe : styles.paymentThem)}}>
                <div style={styles.paymentIcon}>{msg.from === "me" ? "↑" : "↓"}</div>
                <div style={styles.paymentAmount}>{msg.amount} <span style={styles.paymentCurrency}>{msg.currency}</span></div>
                <div style={styles.paymentLabel}>{msg.from === "me" ? "Sent" : "Received"} · {msg.time}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      {showSend && (
        <div style={styles.sendOverlay}>
          <div style={styles.sendSheet}>
            {sendSuccess ? (
              <div style={styles.sendSuccessWrap}>
                <div style={styles.sendSuccessIcon}>✓</div>
                <div style={styles.sendSuccessText}>Sent!</div>
              </div>
            ) : (
              <>
                <div style={styles.sendSheetTitle}>Send to {contact.name.split(" ")[0]}</div>
                <div style={styles.sendSheetSub}>Instant · No fees · USDC on Base</div>
                <div style={styles.sendInputWrap}>
                  <span style={styles.sendDollar}>$</span>
                  <input
                    style={styles.sendInput}
                    type="number"
                    placeholder="0"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={styles.sendQuickAmounts}>
                  {["10", "25", "50", "100"].map(a => (
                    <button key={a} style={styles.quickAmt} onClick={() => setSendAmount(a)}>${a}</button>
                  ))}
                </div>
                <button style={styles.confirmSendBtn} onClick={sendPayment}>Send Now</button>
                <button style={styles.cancelBtn} onClick={() => setShowSend(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      <div style={styles.chatInputRow}>
        <input
          style={styles.chatInput}
          placeholder="Message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.sendMsgBtn} onClick={() => setShowSend(true)}>$</button>
        <button style={styles.sendMsgBtn} onClick={sendMessage}>→</button>
      </div>
      <style>{splashAnim}</style>
    </div>
  );
}

function WalletScreen({ wallet, onBack }) {
  const txns = [
    { id: 1, name: "Amara Diallo", type: "sent", amount: "-50 USDC", time: "Today, 10:31 AM", flag: "🇳🇬" },
    { id: 2, name: "Priya Sharma", type: "received", amount: "+120 USDC", time: "Today, 9:01 AM", flag: "🇮🇳" },
    { id: 3, name: "Kwame Asante", type: "sent", amount: "-200 USDC", time: "Yesterday", flag: "🇬🇭" },
    { id: 4, name: "Chen Wei", type: "sent", amount: "-30 USDC", time: "Yesterday", flag: "🇵🇭" },
  ];

  return (
    <div style={styles.screen}>
      <div style={styles.walletHeader}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.walletHeaderTitle}>My Wallet</div>
      </div>

      <div style={styles.walletCard}>
        <div style={styles.walletCardGlow} />
        <div style={styles.walletCardTop}>
          <span style={styles.walletCardLabel}>Total Balance</span>
          <span style={styles.walletNetwork}>Base Network</span>
        </div>
        <div style={styles.walletCardBalance}>{wallet.balance}</div>
        <div style={styles.walletCardCurrency}>USDC</div>
        <div style={styles.walletCardAddress}>{wallet.address}</div>
      </div>

      <div style={styles.walletActions}>
        <button style={styles.walletActionBtn}>Add Money</button>
        <button style={styles.walletActionBtn}>Withdraw</button>
      </div>

      <div style={styles.txnHeader}>Recent Transactions</div>
      <div style={styles.txnList}>
        {txns.map(t => (
          <div key={t.id} style={styles.txnRow}>
            <div style={styles.txnFlag}>{t.flag}</div>
            <div style={styles.txnInfo}>
              <div style={styles.txnName}>{t.name}</div>
              <div style={styles.txnTime}>{t.time}</div>
            </div>
            <div style={{...styles.txnAmount, color: t.type === "received" ? "#4ade80" : "#f87171"}}>{t.amount}</div>
          </div>
        ))}
      </div>
      <style>{splashAnim}</style>
    </div>
  );
}

const C = {
  bg: "#0a0a0a",
  surface: "#111111",
  surface2: "#1a1a1a",
  border: "#222222",
  accent: "#F5A623",
  accentDim: "#3a2800",
  text: "#f0f0f0",
  textSub: "#666666",
  textMuted: "#444444",
  green: "#4ade80",
  red: "#f87171",
};

const styles = {
  root: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#050505", fontFamily: "'DM Sans', sans-serif" },
  phone: { width: 390, height: 780, background: C.bg, borderRadius: 40, overflow: "hidden", position: "relative", boxShadow: "0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px #1a1a1a" },
  screen: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" },

  splash: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: C.bg, position: "relative" },
  splashGlow: { position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
  splashLogo: { textAlign: "center", zIndex: 1 },
  splashLogoText: { fontSize: 64, fontWeight: 800, color: C.accent, letterSpacing: -3, fontFamily: "'DM Sans', sans-serif" },
  splashTagline: { fontSize: 13, color: C.textSub, letterSpacing: 2, textTransform: "uppercase", marginTop: 8 },
  splashDots: { display: "flex", gap: 6, marginTop: 48, zIndex: 1 },
  splashDot: { width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "pulse 1.2s ease-in-out infinite" },

  onboard: { width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 28px 36px", boxSizing: "border-box", background: C.bg },
  onboardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 },
  onboardLogo: { fontSize: 24, fontWeight: 800, color: C.accent, letterSpacing: -1 },
  onboardProgress: { display: "flex", gap: 6 },
  onboardDot: { width: 8, height: 8, borderRadius: "50%", transition: "background 0.3s" },
  onboardContent: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  onboardEmoji: { fontSize: 48, marginBottom: 20 },
  onboardTitle: { fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 12 },
  onboardSub: { fontSize: 15, color: C.textSub, lineHeight: 1.6, marginBottom: 32 },
  onboardInput: { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", color: C.text, fontSize: 16, outline: "none", marginBottom: 16, width: "100%", boxSizing: "border-box" },
  onboardBtn: { background: C.accent, color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", transition: "opacity 0.2s" },
  walletCreating: { fontSize: 12, color: C.accent, textAlign: "center", marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" },

  homeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "52px 20px 16px" },
  homeGreeting: { fontSize: 13, color: C.textSub },
  homeName: { fontSize: 22, fontWeight: 700, color: C.text },
  walletChip: { background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 20, padding: "8px 14px", color: C.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  walletChipDot: { width: 6, height: 6, borderRadius: "50%", background: C.accent },

  tabBar: { display: "flex", padding: "0 20px", gap: 4, marginBottom: 8 },
  tab: { background: "transparent", border: "none", color: C.textSub, fontSize: 14, fontWeight: 600, padding: "8px 16px", borderRadius: 8, cursor: "pointer" },
  tabActive: { background: C.surface2, color: C.text },

  contactList: { flex: 1, overflowY: "auto", padding: "0 12px" },
  contactRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", background: "transparent", border: "none", width: "100%", cursor: "pointer", borderRadius: 12, textAlign: "left", transition: "background 0.15s" },
  avatarWrap: { position: "relative", flexShrink: 0 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.accent },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: C.green, border: `2px solid ${C.bg}` },
  contactInfo: { flex: 1, minWidth: 0 },
  contactTop: { display: "flex", justifyContent: "space-between", marginBottom: 2 },
  contactName: { fontSize: 15, fontWeight: 600, color: C.text },
  contactTime: { fontSize: 11, color: C.textSub },
  contactBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  contactPreview: { fontSize: 13, color: C.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 },
  unreadBadge: { background: C.accent, color: "#000", borderRadius: 10, padding: "2px 7px", fontSize: 11, fontWeight: 700 },
  contactLocation: { fontSize: 11, color: C.textMuted, marginTop: 2 },

  bottomNav: { display: "flex", justifyContent: "space-around", padding: "12px 0 24px", borderTop: `1px solid ${C.border}` },
  navBtn: { background: "transparent", border: "none", fontSize: 22, cursor: "pointer", padding: "8px 20px" },

  chatHeader: { display: "flex", alignItems: "center", gap: 10, padding: "52px 16px 12px", borderBottom: `1px solid ${C.border}` },
  backBtn: { background: "transparent", border: "none", color: C.text, fontSize: 20, cursor: "pointer", padding: "4px 8px 4px 0" },
  chatHeaderAvatar: { width: 36, height: 36, borderRadius: "50%", background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontSize: 15, fontWeight: 600, color: C.text },
  chatHeaderSub: { fontSize: 11, color: C.textSub },
  sendMoneyBtn: { background: C.accentDim, border: `1px solid ${C.accent}44`, color: C.accent, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" },

  messageList: { flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 },
  msgRow: { display: "flex" },
  bubble: { maxWidth: "72%", padding: "10px 14px", borderRadius: 16, fontSize: 14, lineHeight: 1.4, position: "relative" },
  bubbleMe: { background: C.accent, color: "#000", borderBottomRightRadius: 4 },
  bubbleThem: { background: C.surface2, color: C.text, borderBottomLeftRadius: 4 },
  msgTime: { display: "block", fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" },

  paymentBubble: { padding: "14px 18px", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 140 },
  paymentMe: { background: `linear-gradient(135deg, ${C.accentDim}, #2a1500)`, border: `1px solid ${C.accent}44` },
  paymentThem: { background: `linear-gradient(135deg, #0a2a0a, #0f1f0f)`, border: `1px solid ${C.green}44` },
  paymentIcon: { fontSize: 20, color: C.accent },
  paymentAmount: { fontSize: 22, fontWeight: 800, color: C.text },
  paymentCurrency: { fontSize: 13, color: C.textSub, fontWeight: 400 },
  paymentLabel: { fontSize: 11, color: C.textSub },

  sendOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", zIndex: 10 },
  sendSheet: { width: "100%", background: C.surface, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", boxSizing: "border-box" },
  sendSheetTitle: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 },
  sendSheetSub: { fontSize: 12, color: C.textSub, marginBottom: 24 },
  sendInputWrap: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  sendDollar: { fontSize: 32, color: C.accent, fontWeight: 700 },
  sendInput: { flex: 1, background: "transparent", border: "none", fontSize: 48, fontWeight: 800, color: C.text, outline: "none", width: "100%" },
  sendQuickAmounts: { display: "flex", gap: 8, marginBottom: 20 },
  quickAmt: { flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 0", color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  confirmSendBtn: { width: "100%", background: C.accent, color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
  cancelBtn: { width: "100%", background: "transparent", border: "none", color: C.textSub, fontSize: 14, cursor: "pointer", padding: "8px" },
  sendSuccessWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0" },
  sendSuccessIcon: { width: 64, height: 64, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#000", fontWeight: 700, marginBottom: 12 },
  sendSuccessText: { fontSize: 20, fontWeight: 700, color: C.text },

  chatInputRow: { display: "flex", gap: 8, padding: "10px 12px 28px", borderTop: `1px solid ${C.border}` },
  chatInput: { flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "10px 16px", color: C.text, fontSize: 14, outline: "none" },
  sendMsgBtn: { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "50%", width: 40, height: 40, color: C.accent, fontSize: 16, cursor: "pointer", fontWeight: 700 },

  walletHeader: { display: "flex", alignItems: "center", gap: 12, padding: "52px 20px 16px" },
  walletHeaderTitle: { fontSize: 18, fontWeight: 700, color: C.text },
  walletCard: { margin: "0 16px 20px", borderRadius: 20, background: "linear-gradient(135deg, #1a0f00, #2a1800)", border: `1px solid ${C.accent}33`, padding: "24px 20px", position: "relative", overflow: "hidden" },
  walletCardGlow: { position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)` },
  walletCardTop: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  walletCardLabel: { fontSize: 12, color: C.textSub, textTransform: "uppercase", letterSpacing: 1 },
  walletNetwork: { fontSize: 11, color: C.accent, background: C.accentDim, borderRadius: 6, padding: "2px 8px" },
  walletCardBalance: { fontSize: 42, fontWeight: 800, color: C.text, lineHeight: 1 },
  walletCardCurrency: { fontSize: 14, color: C.textSub, marginTop: 4, marginBottom: 12 },
  walletCardAddress: { fontSize: 11, color: C.textMuted, fontFamily: "monospace" },
  walletActions: { display: "flex", gap: 10, padding: "0 16px 20px" },
  walletActionBtn: { flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  txnHeader: { fontSize: 13, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1, padding: "0 20px 12px" },
  txnList: { flex: 1, overflowY: "auto", padding: "0 16px" },
  txnRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}` },
  txnFlag: { fontSize: 24 },
  txnInfo: { flex: 1 },
  txnName: { fontSize: 14, fontWeight: 600, color: C.text },
  txnTime: { fontSize: 12, color: C.textSub },
  txnAmount: { fontSize: 15, fontWeight: 700 },
};

const splashAnim = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
  @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
  * { -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar { display: none; }
`;
