import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content: "Hi! I'm your AI Gift Assistant 🎁 Tell me about your gifting needs — budget, occasion, recipient type, and quantity — and I'll recommend the perfect corporate gifts.",
    timestamp: new Date().toISOString(),
  },
];

const AI_RESPONSES = [
  {
    trigger: ['budget', 'price', 'cost', '₹', 'inr'],
    reply: "Great! Based on your budget range, here are my top recommendations:",
    products: ['Premium Leather Notebook Set', 'Smart Wireless Charger Pad', 'Bamboo Eco Kit'],
  },
  {
    trigger: ['executive', 'ceo', 'board', 'luxury', 'premium'],
    reply: "For executive-level gifting, I'd suggest these exclusive options:",
    products: ['Crystal Desk Organizer', 'Gold-Edge Business Card Holder', 'Premium Gift Hamper Set'],
  },
  {
    trigger: ['eco', 'green', 'sustainable', 'environment', 'csr'],
    reply: "Excellent choice for sustainable gifting! Here are eco-friendly options:",
    products: ['Bamboo Eco Kit', 'Custom Tote Bag Collection', 'Smart Water Bottle'],
  },
  {
    trigger: ['festive', 'diwali', 'christmas', 'eid', 'occasion', 'celebrate'],
    reply: "For festive corporate gifting, these curated options work beautifully:",
    products: ['Artisan Chocolate Gift Box', 'Premium Gift Hamper Set', 'Luxury Bathrobe & Slipper Set'],
  },
  {
    trigger: ['team', 'employee', 'staff', 'workforce'],
    reply: "For employee appreciation gifts, here are crowd-pleasing choices:",
    products: ['Branded Hoodie & Cap Combo', 'Smart Water Bottle', 'Bamboo Eco Kit'],
  },
];

const DEFAULT_RESPONSE = {
  reply: "Thanks for sharing! Based on your requirements, here are some popular options I'd recommend:",
  products: ['Premium Leather Notebook Set', 'Smart Wireless Charger Pad', 'Artisan Chocolate Gift Box'],
};

function getAIResponse(input) {
  const lower = input.toLowerCase();
  for (const resp of AI_RESPONSES) {
    if (resp.trigger.some(t => lower.includes(t))) return resp;
  }
  return DEFAULT_RESPONSE;
}

export default function ChatInterface() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const response = getAIResponse(input);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.reply,
        products: response.products,
        timestamp: new Date().toISOString(),
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-xl hover:shadow-brand-500/40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse">AI</span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-surface-800 border border-surface-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-brand-900/80 to-brand-800/50 border-b border-surface-700/50 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-surface-100 font-semibold text-sm">AI Gift Assistant</p>
              <p className="text-emerald-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-0">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-surface-600' : 'bg-brand-600'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-surface-200" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-surface-700 text-surface-200 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                  {msg.products && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.products.map(p => (
                        <span key={p} className="px-2 py-1 bg-brand-900/40 border border-brand-500/30 text-brand-300 text-xs rounded-lg cursor-pointer hover:bg-brand-800/60 transition-colors">
                          🎁 {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-surface-700 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-700/50 flex-shrink-0">
            <div className="flex items-center gap-2 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 focus-within:border-brand-500 transition-colors">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Describe your gifting needs..."
                className="flex-1 bg-transparent text-sm text-surface-200 placeholder-surface-600 outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-surface-600 text-center mt-1.5">Try: "eco gifts under ₹1000" or "luxury executive set"</p>
          </div>
        </div>
      )}
    </>
  );
}
