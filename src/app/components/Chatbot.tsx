import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useGasStations } from '../../hooks/useGasStations'; // 1. Import your hook

type ChatbotProps = {
  onClose: () => void;
};

export function Chatbot({ onClose }: ChatbotProps) {
  const { getCheapest, getNearest } = useGasStations(); // 2. Access the data
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false); // 5. Thinking state
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I can help you with El Paso gas prices. How can I help?', sender: 'bot' },
  ]);

  const handleSend = () => {
    if (!message.trim() || isThinking) return;

    // 1. Add the user's message to the UI
    const userMsg = {
      id: Date.now(),
      text: message,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    
    // 2. Start the "Thinking..." animation
    setIsThinking(true);

    // 3. Get the cheapest station from your existing hook
    const cheapest = getCheapest()[0];

    // 4. Simulate a delay to make the "AI" feel real
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `The cheapest gas available is: ${cheapest.name} at ${cheapest.price} per gallon. It is located ${cheapest.distance} away.`,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsThinking(false);
    }, 1600); // 1.2 seconds feels natural for a "search"
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-xl w-full h-[70vh] flex flex-col animate-slide-up">
        {/* Header - same as yours */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-base font-medium">FuelWise Assistant</h3>
            <p className="text-xs text-[#CED0CE]">Powered by El Paso Real-time Data</p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                msg.sender === 'user' ? 'bg-[#F15025] text-white' : 'bg-[#E6E8E6] text-[#191919]'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* 5. Thinking Indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-[#E6E8E6] px-4 py-2 rounded-xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#F15025]" />
                <span className="text-xs text-[#191919]">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isThinking}
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#F15025]"
            />
            <button onClick={handleSend} disabled={isThinking} className="bg-[#F15025] p-2 rounded-lg text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}