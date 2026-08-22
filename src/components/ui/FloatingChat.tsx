import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, FileText, Loader2 } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { ConfidenceTier, DataSource } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: DataSource[];
  confidence?: ConfidenceTier;
  isError?: boolean;
}

let messageCounter = 0;
const generateMsgId = (prefix: string) => {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
};

export const FloatingChat: React.FC = () => {
  const navigate = useNavigate();
  const { documents, metrics, risks, healthScore } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am your financial analyst assistant. Ask me anything about your uploaded financial statements, computed metrics, or identified risk signals.',
      timestamp: 'Just now',
      confidence: 'inferred',
    },
  ]);

  const suggestedQuestions = [
    'Why did operating cash flow shift in the latest period?',
    'What is driving the current recognized revenue growth?',
    'Break down the net profit margin and liquidity position.',
    'Summarize the active anomaly flags and risk exposure.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const questionText = (textToSend || inputValue).trim();
    if (!questionText || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateMsgId('user'),
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Build context payload from current WorkspaceContext
    const contextPayload = {
      documents: documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        status: doc.status,
        uploadedAt: doc.uploadedAt,
        extractedData: doc.extractedData,
      })),
      metrics: metrics.map((m) => ({
        id: m.id,
        name: m.name,
        value: m.value,
        unit: m.unit,
        formula: m.formula,
        inputs: m.inputs,
        comparedTo: m.comparedTo,
        confidence: m.confidence,
      })),
      risks: risks.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        severity: r.severity,
        category: r.category,
        currentValue: r.currentValue,
        comparedValue: r.comparedValue,
        deviation: r.deviation,
        evidence: r.evidence,
      })),
      healthScore: healthScore,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          context: contextPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: generateMsgId('assistant'),
        sender: 'assistant',
        text: data.answer || 'No response returned from AI assistant.',
        sources: Array.isArray(data.sources) ? data.sources : [],
        confidence: 'inferred',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: generateMsgId('assistant-err'),
        sender: 'assistant',
        text: 'Unable to connect to AI service. Your computed metrics and risks are still available on the dashboard.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceClick = (src: DataSource) => {
    // Navigate to documents repository or files inspection view
    if (src.documentId || src.documentName) {
      navigate('/documents');
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
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
            className="fixed bottom-20 right-6 w-[410px] max-w-[calc(100vw-2rem)] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Dark Header (#0B0F17) */}
            <div className="bg-[#0B0F17] p-4 text-white flex items-center justify-between border-b border-[#1E2738] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FB923C]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide flex items-center gap-1.5 text-white">
                    <span>Fizo Financial Assistant</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-orange-500/20 text-[#FB923C]">
                      Gemini AI
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Grounded strictly on uploaded financial records
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat"
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
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-[#0B0F17] text-[#FB923C] border border-[#1E2738]'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Message Bubble: Light Teal for User, Light Gray for AI */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-teal-50 text-teal-950 border border-teal-200/80 rounded-tr-none'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-none'
                        : 'bg-gray-100 text-gray-900 border border-gray-200/90 rounded-tl-none'
                    }`}
                  >
                    {/* Confidence Tier Badge for AI Answers */}
                    {msg.sender === 'assistant' && !msg.isError && (
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-gray-200/70">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                          Analyst Insight
                        </span>
                        <ConfidenceBadge tier={msg.confidence || 'inferred'} />
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Sources Section (Clickable doc name + row/page) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2.5 mt-2.5 border-t border-gray-200/80">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                          Sources & Evidence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSourceClick(src)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-teal-50 text-gray-700 hover:text-teal-800 border border-gray-200 hover:border-teal-300 text-[11px] font-medium transition-colors cursor-pointer group shadow-2xs"
                              title={`Inspect source: ${src.documentName}`}
                            >
                              <FileText className="w-3 h-3 text-teal-600 group-hover:text-teal-700 flex-shrink-0" />
                              <span className="font-medium truncate max-w-[130px]">
                                {src.documentName}
                              </span>
                              {(src.page !== undefined || src.row !== undefined) && (
                                <span className="text-[10px] text-gray-500 group-hover:text-teal-700 font-mono bg-gray-100 group-hover:bg-teal-100/60 px-1 rounded">
                                  {src.page !== undefined ? `p.${src.page}` : `r.${src.row}`}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={`text-[9px] block mt-1.5 ${
                        msg.sender === 'user' ? 'text-teal-700/70 text-right' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator: Three Pulsing Dots */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0B0F17] text-[#FB923C] border border-[#1E2738] flex items-center justify-center flex-shrink-0 text-[10px]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 h-4">
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                        style={{ animationDuration: '1s', animationDelay: '0ms' }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                        style={{ animationDuration: '1s', animationDelay: '200ms' }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                        style={{ animationDuration: '1s', animationDelay: '400ms' }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Chips */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:opacity-50 transition-colors border border-gray-200 cursor-pointer flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Ask about workspace metrics..."
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
