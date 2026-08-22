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
  const { documents } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am your Fizo AI Assistant. Ask me anything about your financial intelligence, cash flow patterns, or anomaly flags.',
      timestamp: 'Just now',
    },
  ]);

  const suggestedQuestions = [
    'Why did operating cash flow shift in the latest period?',
    'What is driving the current recognized revenue growth?',
    'Break down the net financial position of RM 216,500.',
    'Summarize the active anomaly flag and risk exposure.',
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
        reply = "Operating cash flow is positive at RM 108,640.00 (+6.1% vs. prior period) backed by timely receivables collection and disciplined working capital allocation.";
      } else if (text.toLowerCase().includes('revenue') || text.toLowerCase().includes('growth')) {
        reply = "Recognized revenue reached RM 388,000.00 (+14.2% vs. prior period), driven primarily by corporate catering contracts and enterprise orders synthesized from Q3 PnL statements.";
      } else if (text.toLowerCase().includes('position') || text.toLowerCase().includes('net financial')) {
        reply = "Net financial position stands strong at RM 216,500.00 (+8.5% vs. prior period), providing a healthy liquidity buffer for ongoing operations.";
      } else if (text.toLowerCase().includes('risk') || text.toLowerCase().includes('anomaly') || text.toLowerCase().includes('flag')) {
        reply = "There is 1 active anomaly flag: Recurring Cloud Hosting audit invoice variance requiring verification against the tax receipt.";
      } else {
        reply = `Based on the active workspace dataset (${documents.length || 3} source documents), your Financial Health Index is rated 82/100 with all calculations executed strictly in your browser.`;
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Button (Matching Screenshot: Dark pill with ✨ Ask Assistant) */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B0F17] hover:bg-[#18202F] text-white shadow-xl transition-all focus:outline-none cursor-pointer border border-gray-800"
        aria-label="Ask Assistant"
      >
        <Sparkles className="w-4 h-4 text-[#FB923C]" />
        <span className="font-bold text-xs tracking-wide">Ask Assistant</span>
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
            {/* Dark Header (#0B0F17) */}
            <div className="bg-[#0B0F17] p-4 text-white flex items-center justify-between border-b border-[#1E2738]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FB923C]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide flex items-center gap-1.5 text-white">
                    <span>Fizo AI Assistant</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-orange-500/20 text-[#FB923C]">
                      Local AI
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Real-time Client-Side Financial Intelligence
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                        ? 'bg-[#EA580C] text-white'
                        : 'bg-[#0B0F17] text-[#FB923C] border border-[#1E2738]'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#EA580C] text-white rounded-tr-none'
                        : 'bg-white text-[#111827] border border-gray-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        msg.sender === 'user' ? 'text-orange-200 text-right' : 'text-gray-400'
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
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#EA580C] hover:border-orange-200 transition-colors border border-gray-200 cursor-pointer flex-shrink-0"
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
                placeholder="Ask about workspace metrics..."
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="p-2 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white transition-colors cursor-pointer"
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
