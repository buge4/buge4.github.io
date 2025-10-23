import { useState, useEffect, useRef } from 'react';
import { db, functions } from '../lib/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { KingmakerConversation } from '../lib/types';

interface Message {
  id: string;
  message: string;
  response?: string;
  timestamp: string;
  isUser: boolean;
}

export default function CommandTerminal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to real-time conversation updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'kingmaker_conversations'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const conv = { id: change.doc.id, ...change.doc.data() } as KingmakerConversation;
            setMessages((prev) => [
              ...prev,
              {
                id: conv.id,
                message: conv.user_message,
                response: conv.ai_response || undefined,
                timestamp: conv.created_at,
                isUser: true,
              },
            ]);
            if (conv.ai_response) {
              setMessages((prev) => [
                ...prev,
                {
                  id: `${conv.id}-response`,
                  message: conv.ai_response!,
                  timestamp: conv.created_at,
                  isUser: false,
                },
              ]);
            }
          }
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: input,
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    const command = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call Cloud Function to orchestrate the task
      const orchestrateTask = httpsCallable(functions, 'orchestrateTask');
      const result = await orchestrateTask({ task: command });
      
      const response: Message = {
        id: `${Date.now()}-response`,
        message: (result.data as any)?.message || `Task completed: "${command}"`,
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      const errorResponse: Message = {
        id: `${Date.now()}-error`,
        message: `Error: ${error instanceof Error ? error.message : 'Failed to process command'}`,
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558] h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#3d4558]">
        <h3 className="text-lg font-semibold text-[#f5f7fa]">Command Terminal</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-pulse" />
          <span className="text-sm text-[#c8d0dd]">Connected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 font-mono text-sm">
        {messages.length === 0 && (
          <div className="text-[#7b8599] italic">Awaiting commands...</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.isUser ? 'text-[#00d9ff]' : 'text-[#c8d0dd]'
            } transition-opacity duration-250`}
          >
            <span className="text-[#7b8599]">
              [{new Date(msg.timestamp).toLocaleTimeString()}]
            </span>{' '}
            {msg.isUser && <span className="text-[#00d9ff]">&gt; </span>}
            {msg.message}
          </div>
        ))}
        {isLoading && (
          <div className="text-[#7b8599] animate-pulse">Processing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 bg-[#252b45] rounded-lg border border-[#3d4558] focus-within:border-[#00d9ff] focus-within:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-150">
          <div className="flex items-center px-4 py-3">
            <span className="text-[#00d9ff] font-mono mr-2">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-[#f5f7fa] font-mono text-base outline-none placeholder-[#7b8599]"
              placeholder="Enter command..."
              disabled={isLoading}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-[#00d9ff] text-[#0a0e1a] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
