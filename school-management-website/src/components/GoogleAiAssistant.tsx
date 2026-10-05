'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Key, 
  RefreshCw, 
  FileText, 
  Bell, 
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}

export default function GoogleAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'remarks' | 'notice'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Remarks generator state
  const [studentName, setStudentName] = useState('Amina Rinsha');
  const [studentClass, setStudentClass] = useState('Standard 10 - A');
  const [studentMarksSummary, setStudentMarksSummary] = useState('English: 98/100 (A+), Maths: 89/100 (A), Science: 90/100 (A+), Social: 87/100 (A), Attendance: 96.2%');

  // Notice generator state
  const [noticeTopic, setNoticeTopic] = useState('Heavy rainfall red alert holiday tomorrow announced by District Collector');
  const [noticeAudience, setNoticeAudience] = useState('All Parents & Guardians');

  // Load custom key from localStorage on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('google_ai_custom_key');
      if (savedKey) {
        setCustomApiKey(savedKey);
        setApiKeySaved(true);
      }
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome to KlassDesk Google AI Copilot!**\n\nI am powered by **Google Gemini 2.0 Flash** for P.P.M. Higher Secondary School (PPMHSS Kottukkara).\n\nAsk me anything about:\n- 📝 **Automated Report Card Remarks**\n- 🔒 **Single-Subject Revert & Draft Locks**\n- ⚡ **Kerala Samboorna CSV Import**\n- 📢 **Bilingual SMS & WhatsApp Alerts (English & Malayalam)**\n- 🏆 **Sports & Arts Fest Scoring**`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      if (customApiKey.trim()) {
        localStorage.setItem('google_ai_custom_key', customApiKey.trim());
        setApiKeySaved(true);
      } else {
        localStorage.removeItem('google_ai_custom_key');
        setApiKeySaved(false);
      }
    }
    setShowKeyModal(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          mode: 'chat',
          customApiKey: customApiKey.trim() || undefined,
          messages: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      const replyContent = data.message || data.error || 'No response generated.';

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.simulated
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Error communicating with Google AI Studio: ${err.message}. Please check your connection or API key.`,
          timestamp: 'Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRemarks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'remarks',
          customApiKey: customApiKey.trim() || undefined,
          studentData: {
            name: studentName,
            class: studentClass,
            marks: { summary: studentMarksSummary },
            attendance: '96.2%',
            percentage: '92.4%',
            rank: '1st'
          }
        })
      });

      const data = await res.json();
      setActiveTab('chat');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: `Generate official report card remarks for ${studentName} (${studentClass}) based on: ${studentMarksSummary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'No remarks generated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSimulated: data.simulated
        }
      ]);
    } catch (err: any) {
      alert(`Error generating remarks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'notice',
          customApiKey: customApiKey.trim() || undefined,
          noticeData: {
            topic: noticeTopic,
            audience: noticeAudience,
            date: new Date().toLocaleDateString('en-GB')
          }
        })
      });

      const data = await res.json();
      setActiveTab('chat');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: `Draft official school notification for "${noticeTopic}" to ${noticeAudience}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'No notice generated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSimulated: data.simulated
        }
      ]);
    } catch (err: any) {
      alert(`Error generating notice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2 pointer-events-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto p-3.5 sm:px-4 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer ring-4 ring-white"
          aria-label="Toggle Google AI Assistant"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            {isOpen ? 'Close Google AI' : 'Google AI Copilot'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/25 text-[10px] font-mono font-bold uppercase">
            Gemini 2.0
          </span>
        </button>
      </div>

      {/* Slide-Up Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-5 z-50 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] max-h-[85vh] rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-indigo-950/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white">KlassDesk Google AI</h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                    Gemini 2.0 Flash
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Project: PPM HSS KOTTUKKARA (Google AI Studio)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(true)}
                title="Configure Google AI Studio API Key"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  apiKeySaved ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-white/10 text-slate-300'
                }`}
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feature Mode Tabs */}
          <div className="flex items-center justify-around bg-slate-100/90 border-b border-slate-200 p-1 text-xs shrink-0 font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat' 
                  ? 'bg-white text-indigo-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('remarks')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'remarks' 
                  ? 'bg-white text-indigo-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report Remarks</span>
            </button>
            <button
              onClick={() => setActiveTab('notice')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'notice' 
                  ? 'bg-white text-indigo-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Bilingual Notices</span>
            </button>
          </div>

          {/* Tab 1: AI Chat Area */}
          {activeTab === 'chat' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50">
              {messages.map((m) => {
                const isBot = m.role === 'assistant';
                return (
                  <div 
                    key={m.id} 
                    className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      isBot 
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white' 
                        : 'bg-slate-900 text-white'
                    }`}>
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 relative group ${
                      isBot 
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-xs' 
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}>
                      {isBot && (
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[10px] text-slate-400">
                          <span className="font-bold flex items-center gap-1 text-indigo-600">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Gemini 2.0 Flash
                          </span>
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="hover:text-slate-700 p-0.5 rounded cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      )}

                      <div className="whitespace-pre-line leading-relaxed text-[11px] sm:text-xs">
                        {m.content}
                      </div>

                      <div className={`text-[9px] pt-1 ${isBot ? 'text-slate-400' : 'text-indigo-200 text-right'}`}>
                        {m.timestamp}
                        {m.isSimulated && <span className="ml-1.5 text-amber-600 font-semibold">• Demo Mode</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 w-fit text-slate-500 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span className="text-[11px] font-medium">Google Gemini is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Tab 2: AI Report Card Remarks Generator */}
          {activeTab === 'remarks' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-white">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Teacher Appraisal Generator
                </span>
                <p className="text-[11px] text-indigo-800">
                  Saves teachers 40+ hours per term by creating high-quality qualitative student appraisals in English and Malayalam from raw marks.
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard &amp; Division</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marks &amp; Performance Summary</label>
                  <textarea
                    rows={3}
                    value={studentMarksSummary}
                    onChange={(e) => setStudentMarksSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 text-[11px] focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. English: 98 (A+), Maths: 89 (A), Attendance: 96%"
                  />
                </div>

                <button
                  onClick={handleGenerateRemarks}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Generating with Gemini...' : 'Generate Official Remarks'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: AI Bilingual Notification Drafter */}
          {activeTab === 'notice' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-white">
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-purple-600" />
                  Bilingual SMS &amp; WhatsApp Notice Creator
                </span>
                <p className="text-[11px] text-purple-800">
                  Drafts compliant 160-char carrier SMS and rich Malayalam + English WhatsApp circulars ready for 1-click dispatch.
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notice Topic / Situation</label>
                  <input
                    type="text"
                    value={noticeTopic}
                    onChange={(e) => setNoticeTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. Annual PTA Meeting this Saturday at 10 AM"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Audience</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option>All Parents &amp; Guardians</option>
                    <option>Class 10-A Parents Only</option>
                    <option>High School Section (8, 9, 10)</option>
                    <option>Staff &amp; Faculty Members</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateNotice}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{loading ? 'Drafting with Gemini...' : 'Draft Bilingual Notification'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompt Chips (Chat Mode only) */}
          {activeTab === 'chat' && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
              {[
                "How does single-subject revert work?",
                "Kerala Samboorna CSV features?",
                "Explain 9-point Kerala grading",
                "Draft rain holiday SMS in Malayalam"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-[10px] font-semibold text-slate-700 transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Strip (Chat Mode only) */}
          {activeTab === 'chat' && (
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask Google Gemini about KlassDesk & PPMHSS..."
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Google AI Studio API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-sm text-slate-900">Google AI Studio API Key</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>
                Connect your live API key from <strong>Google AI Studio</strong> (Project: <strong>PPM HSS KOTTUKKARA</strong> or <strong>Portfolio</strong>).
              </p>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold block">💡 Where to find your key:</span>
                <span>Copy the key starting with <code>AIzaSy...</code> from your open Google AI Studio window under <em>API Keys → PPM HSS KOTTUKKARA</em>.</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-xs text-slate-800 block mb-1">Paste Gemini API Key</label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Keys are stored securely in your local browser session or can be configured in <code>.env.local</code> as <code>GEMINI_API_KEY</code>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm cursor-pointer"
              >
                Save &amp; Activate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
