import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FloatingChat: React.FC = () => {
  const { isDemo, metrics, risks } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am FizoAI assistant. Ask me anything about your financial statements, gross margin compression, or cash flow discrepancies.',
      timestamp: 'Just now',
    },
  ]);

  const suggestedQuestions = [
    'Why did operating cash flow turn negative in FY2025?',
    'What caused the gross margin compression from 44% to 39%?',
    'How can Warisan Delights improve its 1.03x current ratio?',
    'Summarize the critical audit risks and anomalies.',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Automated contextual response simulation
    setTimeout(() => {
      let reply = "I analyzed your current active workspace data locally.";

      if (text.toLowerCase().includes('cash flow') || text.toLowerCase().includes('operating cash')) {
        reply = "Operating cash flow turned negative (-RM 28,000 in FY2025 from +RM 198,000 in FY2024) primarily due to a 23.8% surge in operating expenses and extended vendor payment commitments outpacing customer cash collections.";
      } else if (text.toLowerCase().includes('gross margin') || text.toLowerCase().includes('compression')) {
        reply = "Gross margin compressed from 44.0% to 39.0% (-5.0 percentage points) due to Cost of Goods Sold rising from 56% to 61% of revenue (RM 802,516 in FY2025 vs RM 694,400 in FY2024).";
      } else if (text.toLowerCase().includes('current ratio') || text.toLowerCase().includes('liquidity')) {
        reply = "The current ratio tightened to 1.03x (Current Assets RM 355k vs Current Liabilities RM 345k). To restore a safe buffer (>1.20x), consider renegotiating supplier credit terms and securing a short-term working capital facility.";
      } else if (text.toLowerCase().includes('risk') || text.toLowerCase().includes('anomalies') || text.toLowerCase().includes('audit')) {
        reply = `There are ${risks.length} active risk signals flagged, highlighted by Negative Operating Cash Flow (Critical) and Operating Expense Surge exceeding revenue growth by 17.7pp.`;
      } else {
        reply = `Based on the ${isDemo ? 'Warisan Delights dataset' : 'uploaded documents'}, your financial health score is currently ${metrics.length > 0 ? 'evaluated at 32/100' : 'awaiting ingestion'}. All calculations run in your browser sandbox.`;
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-lg transition-all focus:outline-none cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-xs tracking-wide">Ask FizoAI</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white/90">
          Lab 1
        </span>
      </motion.button>

      {/* Slide-up Chat Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-chat-modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Dark Green Header (#0F2B1F) */}
            <div className="bg-[#0F2B1F] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <span>FizoAI Assistant</span>
                    <span className="text-[9px] font-normal px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300">
                      Local AI
                    </span>
                  </h4>
                  <p className="text-[10px] text-emerald-200/70">
                    Real-time Malaysian F&B Intelligence
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAFB] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-[#111827] border border-gray-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Question Chips */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-gray-200/60 cursor-pointer flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Warisan Delights metrics..."
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="p-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
