import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const CHATBOT_RESPONSES: { [key: string]: string } = {
  "fogo": "Se você suspeitar de um fogo, denuncie imediatamente! Clique em 'Reportar Fogo' e compartilhe a localização.",
  "denúncia": "Você pode fazer denúncias clicando no ícone 'Reportar Fogo'. Inclua localização, descrição e intensidade.",
  "alerta": "Os alertas aparecem em tempo real no Dashboard. Você receberá notificações de focos críticos próximos a você.",
  "risco": "O sistema analisa dados climáticos e históricos para identificar áreas de risco. Consulte o Dashboard para ver a análise.",
  "prevenção": "Para prevenir incêndios: não faça queimadas sem licença, evite fogo em dias secos e ventosos, e reporte comportamentos suspeitos.",
  "contato": "Para emergências, contact o Corpo de Bombeiros (193) ou o ICMBio (ICMBio Cerrado).",
  "default": "Olá! Sou o assistente CERES AI. Posso ajudá-lo com dúvidas sobre o CAR, prevenção de incêndios, denúncias ou alertas ambientais. Como posso ajudar?"
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    const botResponse = getBotResponse(input.toLowerCase());
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const getBotResponse = (text: string): string => {
    for (const [key, response] of Object.entries(CHATBOT_RESPONSES)) {
      if (key !== "default" && text.includes(key)) {
        return response;
      }
    }
    return CHATBOT_RESPONSES.default;
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-chatbot-toggle"
        className="fixed bottom-6 right-6 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all z-40"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-emerald-100">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold text-lg">CERES AI Assistente</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-emerald-700 rounded"
              data-testid="button-chatbot-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                <p>Olá! 👋</p>
                <p>Pergunte sobre prevenção, denúncias ou alertas.</p>
              </div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-emerald-100 text-emerald-900 rounded-bl-none"
                  }`}
                  data-testid={`message-${msg.sender}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Sua pergunta..."
              data-testid="input-chatbot-message"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-chatbot-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
