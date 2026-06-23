import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, Send, Leaf } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

type ResponseMap = { keywords: string[]; response: string }[];

const KNOWLEDGE_BASE: ResponseMap = [
  {
    keywords: ["car", "cadastro ambiental rural", "o que é car", "que é o car"],
    response: "O **CAR (Cadastro Ambiental Rural)** é um registro eletrônico obrigatório para todos os imóveis rurais no Brasil. Criado pela Lei nº 12.651/2012, reúne informações geoespaciais sobre a propriedade, como localização, tamanho, APP, Reserva Legal e áreas de uso consolidado. É o primeiro passo para a regularização ambiental. Cadastre-se em sicar.gov.br.",
  },
  {
    keywords: ["sicar", "sistema nacional", "como me cadastrar", "inscrição car"],
    response: "O **SICAR (Sistema de Cadastro Ambiental Rural)** é a plataforma nacional do CAR em sicar.gov.br. Para se cadastrar: 1) Acesse o SICAR do seu estado, 2) Preencha os dados do imóvel, 3) Insira as coordenadas georreferenciadas, 4) Delimite APP, Reserva Legal e uso consolidado no mapa, 5) Envie e aguarde análise. É gratuito para agricultores familiares.",
  },
  {
    keywords: ["app", "área de preservação permanente", "mata ciliar", "beira de rio"],
    response: "A **APP (Área de Preservação Permanente)** é uma área protegida por lei que não pode ser desmatada. Inclui: margens de rios (30 a 500m dependendo da largura), topos de morro, encostas, bordas de tabuleiro e áreas de restinga. Mesmo em propriedades privadas, a APP deve ser mantida íntegra. Base legal: art. 4º da Lei nº 12.651/2012.",
  },
  {
    keywords: ["reserva legal", "rl", "percentual", "quanto deve ter"],
    response: "A **Reserva Legal** é a área dentro do imóvel rural que deve ser mantida com vegetação nativa. Os percentuais são: **Amazônia Legal: 80%** da propriedade, **Cerrado na Amazônia Legal: 35%**, **Cerrado fora da Amazônia (outros biomas): 20%**, **Campos Gerais: 20%**. Pode ser compensada em outra área, desde que no mesmo bioma. Base legal: art. 12 da Lei nº 12.651/2012.",
  },
  {
    keywords: ["código florestal", "lei florestal", "lei 12651", "legislação"],
    response: "O **Código Florestal (Lei nº 12.651/2012)** é a principal legislação ambiental para imóveis rurais no Brasil. Define regras para APP, Reserva Legal, áreas consolidadas, e institui o CAR e o PRA (Programa de Regularização Ambiental). Produtores que tinham desmatamento antes de 22/07/2008 têm benefícios para regularização via PRA.",
  },
  {
    keywords: ["pra", "programa de regularização", "regularizar", "regularização ambiental"],
    response: "O **PRA (Programa de Regularização Ambiental)** permite que produtores rurais com passivo ambiental anterior a 22/07/2008 se regularizem gradualmente, sem multas. O passo a passo é: 1) Inscrever no CAR, 2) Ter análise do CAR aprovada, 3) Assinar Termo de Compromisso com o órgão ambiental estadual, 4) Recuperar ou compensar as áreas degradadas.",
  },
  {
    keywords: ["desmatamento", "corte de árvore", "desmatar", "posso cortar"],
    response: "O desmatamento sem autorização é crime ambiental (Lei 9.605/98). Para suprimir vegetação nativa é necessária **Autorização de Supressão de Vegetação (ASV)** emitida pelo órgão ambiental estadual (SEMA/IEF/SEMAD, dependendo do estado). Em APP e Reserva Legal, o corte é proibido, exceto em casos de utilidade pública ou interesse social previstos em lei.",
  },
  {
    keywords: ["ibama", "fiscalização", "multa", "autuação", "embargo"],
    response: "O **IBAMA** fiscaliza o cumprimento da legislação ambiental federal. Multas por infrações ambientais vão de R$ 50 a R$ 50 milhões (Decreto nº 6.514/2008). Em caso de embargo, a área não pode ser explorada até a regularização. Para regularizar: inscreva-se no CAR, aderir ao PRA e cumprir o Termo de Compromisso. Contato: 0800 061 8001.",
  },
  {
    keywords: ["fogo", "incêndio", "queimada", "reportar", "denúncia"],
    response: "Para reportar um incêndio: ligue **193 (Bombeiros)** ou **0800 618 080 (IBAMA)**. Você também pode usar a aba **Alertas** do CERES AI para registrar ocorrências. Queimadas sem autorização são crime ambiental. O INPE monitora focos de calor em tempo real via satélite no sistema QUEIMADAS (queimadas.dgi.inpe.br).",
  },
  {
    keywords: ["inpe", "satélite", "monitoramento", "dados"],
    response: "O **INPE (Instituto Nacional de Pesquisas Espaciais)** monitora focos de incêndio, desmatamento e cobertura vegetal via satélite. Acesse os dados em queimadas.dgi.inpe.br e terrabrasilis.dgi.inpe.br. O CERES AI integra dados simulados do INPE e está em desenvolvimento para integração real com a API do instituto.",
  },
  {
    keywords: ["mapbiomas", "cobertura vegetal", "uso da terra"],
    response: "O **MapBiomas** (plataforma.brasil.mapbiomas.org) mapeia a cobertura e uso da terra em todos os biomas brasileiros, usando imagens de satélite e inteligência artificial. Os dados são essenciais para análise de passivos do CAR e verificação de Reserva Legal e APP. O CERES AI será integrado ao MapBiomas para análise automatizada.",
  },
  {
    keywords: ["agricultor familiar", "pequeno produtor", "módulo fiscal", "minifúndio"],
    response: "**Agricultores familiares** com imóveis de até 4 módulos fiscais têm tratamento diferenciado no Código Florestal: isenção de recomposição de APP se a propriedade tinha essa ocupação antes de 22/07/2008, Reserva Legal simplificada, e cadastro CAR gratuito. O **PRONAF** pode financiar projetos de regularização ambiental.",
  },
  {
    keywords: ["georreferenciamento", "coordenadas", "shp", "shapefile", "kml"],
    response: "Para o CAR, você precisa de arquivos georreferenciados nos formatos **SHP (Shapefile)** ou **KML/KMZ**. Use o software **SIGEF** (sigef.incra.gov.br) para georreferenciamento oficial, ou ferramentas como Google Earth Pro (gratuito), QGIS (gratuito) ou ArcGIS. O SICAR aceita upload de arquivos SHP ou delimitação direta no mapa.",
  },
  {
    keywords: ["prazo", "vencimento", "validade", "data limite"],
    response: "O **CAR não tem prazo de validade**, mas imóveis não inscritos ficam sujeitos a restrições de crédito rural e licenciamento ambiental. A análise dos cadastros pelo órgão estadual pode levar meses. Após aprovação, o produtor pode aderir ao PRA para regularização de passivos. Não existem mais prazos adicionais — o CAR é permanente.",
  },
  {
    keywords: ["cerrado", "bioma cerrado", "savana"],
    response: "O **Cerrado** é o segundo maior bioma do Brasil, com cerca de 204 milhões de hectares. É considerado a savana mais biodiversa do mundo. Abriga nascentes de 8 das 12 grandes bacias hidrográficas do Brasil. Em 2024, registrou mais de **81.468 focos de incêndio** (+40% vs 2023). A Reserva Legal obrigatória no Cerrado é de **20%** da propriedade.",
  },
  {
    keywords: ["olá", "oi", "bom dia", "boa tarde", "boa noite", "tudo bem"],
    response: "Olá! 👋 Sou o **CERES AI Assistente**, especializado em Cadastro Ambiental Rural (CAR), Código Florestal, Reserva Legal, APP e regularização ambiental. Como posso ajudar você hoje? Pode perguntar sobre CAR, SICAR, Reserva Legal, APP, PRA, desmatamento, queimadas e muito mais!",
  },
];

const DEFAULT_RESPONSE =
  "Entendi sua pergunta! Sou especializado em **Cadastro Ambiental Rural (CAR)**, Código Florestal, Reserva Legal, APP e regularização ambiental. Pode perguntar sobre: *CAR, SICAR, Reserva Legal, APP, PRA, desmatamento, queimadas, IBAMA, INPE, georreferenciamento* ou qualquer tema ambiental rural. Como posso ajudar?";

function getBotResponse(text: string): string {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const entry of KNOWLEDGE_BASE) {
    const normalizedKeywords = entry.keywords.map(k =>
      k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    if (normalizedKeywords.some(k => lower.includes(k))) {
      return entry.response;
    }
  }
  return DEFAULT_RESPONSE;
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

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
      timestamp: new Date(),
    };

    const botText = getBotResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const QUICK_QUESTIONS = [
    "O que é o CAR?",
    "Como me cadastrar no SICAR?",
    "O que é Reserva Legal?",
    "O que é APP?",
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-chatbot-toggle"
        className="fixed bottom-6 right-6 p-3.5 bg-gradient-to-br from-primary to-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-40"
        aria-label="Abrir assistente CERES AI"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[540px] bg-card rounded-2xl shadow-2xl flex flex-col z-40 border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-none">CERES AI Assistente</h3>
                <p className="text-emerald-300 text-xs mt-0.5">Especialista em CAR & Código Florestal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              data-testid="button-chatbot-close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
            {messages.length === 0 && (
              <div className="text-center mt-4">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary to-emerald-700 rounded-2xl flex items-center justify-center mb-3">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <p className="font-bold text-foreground text-sm mb-1">Olá! Sou o CERES AI 👋</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Especialista em CAR, Código Florestal, Reserva Legal e APP.
                </p>
                <div className="space-y-2">
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          const userMsg: Message = { id: Date.now().toString(), text: q, sender: "user", timestamp: new Date() };
                          const botMsg: Message = { id: (Date.now() + 1).toString(), text: getBotResponse(q), sender: "bot", timestamp: new Date() };
                          setMessages([userMsg, botMsg]);
                          setInput("");
                        }, 50);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-card border border-border/50 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-card border border-border/50 text-foreground rounded-bl-sm"
                  }`}
                  data-testid={`message-${msg.sender}-${msg.id}`}
                  dangerouslySetInnerHTML={
                    msg.sender === "bot"
                      ? { __html: renderMarkdown(msg.text) }
                      : undefined
                  }
                >
                  {msg.sender === "user" ? msg.text : undefined}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-3 flex gap-2 bg-card shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Pergunte sobre CAR, APP, Reserva Legal..."
              data-testid="input-chatbot-message"
              className="flex-1 px-3 py-2 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-primary hover:bg-primary/90 rounded-xl shrink-0"
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
