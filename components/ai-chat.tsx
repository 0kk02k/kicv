'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { Message } from 'ai';
import { X, Send, Bot } from 'lucide-react';

export function AIChat({ portfolioId, primaryColor }: { portfolioId: number, primaryColor: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { portfolioId },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Bubble */}
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-50"
        style={{ backgroundColor: primaryColor }}
      >
        <Bot className="text-white w-8 h-8" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          <header className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
            <div>
              <h3 className="font-bold text-lg">AI Career Twin</h3>
              <p className="text-xs opacity-80">Frage mich alles über diesen Nutzer</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <Bot className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 px-10">
                  Hallo! Ich kenne den Lebenslauf dieses Nutzers in- und auswendig. Was möchtest du wissen?
                </p>
              </div>
            )}
            
            {messages.map((m: Message) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border shadow-sm rounded-bl-none text-gray-800'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-2xl rounded-bl-none p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Frage stellen..."
              className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ outlineColor: primaryColor }}
            />
            <button 
              type="submit" 
              className="p-2 rounded-xl text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
