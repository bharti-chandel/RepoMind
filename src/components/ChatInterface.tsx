import { useState, useRef, useEffect } from "react";
import { Repo, RepoFile, ChatMessage } from "../types";
import { Send, User, Bot, Loader2, FileCode, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithCodebase } from "../services/gemini";
import { motion, AnimatePresence } from "motion/react";

export default function ChatInterface({ repo, selectedFile }: { repo: Repo, selectedFile: RepoFile | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatWithCodebase(
        repo.name, 
        (repo as any).files, 
        messages, 
        selectedFile ? `[Context: File ${selectedFile.path}] ${input}` : input
      );
      
      const botMsg: ChatMessage = { role: 'model', text: response || "I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Failed to connect to AI service.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Chat with {repo.name}</h2>
            <p className="text-primary/60 mb-8">
              Ask questions about the codebase, logic, or how to implement new features.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <SuggestionBtn text="Explain the project architecture" onClick={setInput} />
              <SuggestionBtn text="How are the main components structured?" onClick={setInput} />
              <SuggestionBtn text="What technologies are used here?" onClick={setInput} />
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="text-white w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-ink text-white rounded-tr-none' 
                  : 'bg-white border border-black/5 rounded-tl-none shadow-sm'
              }`}>
                <div className="prose prose-sm prose-stone dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
                  <User className="text-white w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center shrink-0">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-black/5 bg-white/50 backdrop-blur-md">
        {selectedFile && (
          <div className="mb-4 flex items-center gap-2 px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-full w-fit">
            <FileCode className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Focusing on: {selectedFile.path}</span>
          </div>
        )}
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            placeholder="Ask anything about the codebase..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-6 pr-16 py-4 bg-white border border-black/10 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-lg"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-ink text-white rounded-xl hover:bg-ink/90 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-primary/40 mt-4 uppercase tracking-widest">
          RepoMind can make mistakes. Verify important code logic.
        </p>
      </div>
    </div>
  );
}

function SuggestionBtn({ text, onClick }: { text: string, onClick: (t: string) => void }) {
  return (
    <button 
      onClick={() => onClick(text)}
      className="text-left px-4 py-3 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-colors text-sm font-medium text-primary/70"
    >
      {text}
    </button>
  );
}
