import { useState } from "react";
import { useLocation } from "wouter";
import {
  MapPin, AlertTriangle, CheckCircle2, FileText, ChevronRight,
  ArrowLeft, Download, Info, Clock, Landmark, Trees, Droplets,
  TrendingUp, User, X, Printer
} from "lucide-react";

const PROPERTY = {
  nome: "Sítio Boa Esperança",
  proprietario: "Raimundo Silva",
  cpf: "***.***.***-45",
  car: "MG-3170008-00234.2023.1",
  municipio: "Unaí — MG",
  bioma: "Cerrado",
  area_total: "48,5 ha",
  area_app: "6,2 ha",
  reserva_legal: "7,1 ha (14,6%)",
  situacao: "Pendente de análise",
  data_cadastro: "12/03/2023",
};

const PENDENCIAS = [
  {
    tipo: "APP",
    nivel: "alta",
    tecnico: "Inconsistência geoespacial em Área de Preservação Permanente — sobreposição parcial com uso antrópico.",
    simples: "Uma área protegida da sua propriedade (a margem do rio) pode estar desenhada incorretamente no mapa. Parte dela aparece ocupada por plantação, o que não é permitido por lei.",
    acao: "Revise o mapa com um técnico habilitado ou busque apoio gratuito no órgão estadual de meio ambiente.",
    icon: Droplets,
    cor: "rose",
  },
  {
    tipo: "Reserva Legal",
    nivel: "alta",
    tecnico: "Área de Reserva Legal declarada abaixo do percentual mínimo exigido (20%) para imóvel no bioma Cerrado.",
    simples: "Sua propriedade precisa reservar pelo menos 20% da área total para a natureza. Hoje está em 14,6%, o que está abaixo do exigido pelo Código Florestal.",
    acao: "Você pode recuperar vegetação nativa em uma parte do imóvel ou aderir ao Programa de Regularização Ambiental (PRA) do seu estado.",
    icon: Trees,
    cor: "amber",
  },
  {
    tipo: "Nascente",
    nivel: "media",
    tecnico: "Ponto de nascente identificado por sensoriamento remoto não localizado no polígono declarado.",
    simples: "Identificamos uma nascente (olho d'água) na sua propriedade que não foi registrada no cadastro. Nascentes precisam de uma área de proteção ao redor.",
    acao: "Peça para um técnico incluir a nascente no mapa e verificar se a área de proteção ao redor dela está preservada.",
    icon: Droplets,
    cor: "blue",
  },
];

const RECOMENDACOES = [
  { titulo: "Contrate um técnico habilitado", desc: "Um engenheiro florestal ou agrônomo pode corrigir seu CAR e garantir conformidade." },
  { titulo: "Acesse o SICAR", desc: "Pelo site sicar.com.br você pode visualizar e atualizar seu cadastro de forma gratuita." },
  { titulo: "Consulte a Secretaria de Meio Ambiente", desc: "Órgãos estaduais oferecem apoio gratuito para regularização ambiental." },
  { titulo: "Conheça o PRA", desc: "O Programa de Regularização Ambiental permite recuperar áreas de forma planejada, com prazo e apoio técnico." },
];

const SCORE = 67;

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#2E7D32" : score >= 60 ? "#C9A227" : "#dc2626";
  const label = score >= 80 ? "Bom" : score >= 60 ? "Regular" : "Crítico";

  return (
    <div className="flex flex-col items-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text x="64" y="58" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{score}</text>
        <text x="64" y="74" textAnchor="middle" fontSize="10" fill="#6b7280">/100</text>
      </svg>
      <span className="text-sm font-bold mt-1" style={{ color }}>{label}</span>
      <span className="text-xs text-gray-500">Conformidade Ambiental</span>
    </div>
  );
}

function ReportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center" style={{ background: "#0F5132" }}>
          <div>
            <h3 className="text-white font-bold text-lg font-display">Relatório Simplificado</h3>
            <p className="text-green-200 text-xs">Sítio Boa Esperança — {new Date().toLocaleDateString("pt-BR")}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5 text-sm text-gray-700">
          <section>
            <h4 className="font-bold text-gray-900 mb-2 text-base">Dados da Propriedade</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-500">Proprietário:</span> <span className="font-medium">Raimundo Silva</span></div>
              <div><span className="text-gray-500">Município:</span> <span className="font-medium">Unaí — MG</span></div>
              <div><span className="text-gray-500">Área total:</span> <span className="font-medium">48,5 ha</span></div>
              <div><span className="text-gray-500">Bioma:</span> <span className="font-medium">Cerrado</span></div>
              <div><span className="text-gray-500">CAR:</span> <span className="font-medium text-[10px]">MG-3170008-00234.2023.1</span></div>
              <div><span className="text-gray-500">Score:</span> <span className="font-bold text-amber-600">67/100 — Regular</span></div>
            </div>
          </section>
          <section>
            <h4 className="font-bold text-gray-900 mb-2 text-base">Pendências Identificadas</h4>
            {PENDENCIAS.map((p, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-semibold text-gray-800">{i + 1}. {p.tipo}</p>
                <p className="text-gray-600 mt-1">{p.simples}</p>
                <p className="text-[#0F5132] font-medium mt-1">O que fazer: {p.acao}</p>
              </div>
            ))}
          </section>
          <section>
            <h4 className="font-bold text-gray-900 mb-2 text-base">Recomendações</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              {RECOMENDACOES.map((r, i) => <li key={i}><span className="font-medium">{r.titulo}</span>: {r.desc}</li>)}
            </ol>
          </section>
          <p className="text-xs text-gray-400 pt-2 border-t">
            Relatório gerado pelo CERES AI — haCARthon 2026. Este documento é informativo e não substitui análise técnica oficial.
          </p>
        </div>
        <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Fechar</button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-bold text-white rounded-xl flex items-center gap-2 transition-colors"
            style={{ background: "#0F5132" }}
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SimulacaoCar() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"pendencias" | "recomendacoes" | "mapa">("pendencias");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7F8] font-sans">
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0F5132] transition-colors"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">Demonstração</span>
            <span className="text-xs text-gray-400">Dados fictícios para ilustração</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero card */}
        <div className="rounded-2xl text-white p-6 md:p-8 shadow-lg" style={{ background: "linear-gradient(135deg, #0F5132 0%, #2E7D32 100%)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-sm font-medium">Simulação CAR</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">{PROPERTY.nome}</h1>
              <p className="text-green-200 text-sm mb-3">Proprietário: {PROPERTY.proprietario} · CPF: {PROPERTY.cpf}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-white/15 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {PROPERTY.municipio}
                </span>
                <span className="px-3 py-1 bg-white/15 rounded-full flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> {PROPERTY.area_total}
                </span>
                <span className="px-3 py-1 bg-white/15 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Cadastrado em {PROPERTY.data_cadastro}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ScoreRing score={SCORE} />
            </div>
          </div>
        </div>

        {/* CAR number + status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Número do CAR</p>
            <p className="font-mono text-sm font-bold text-gray-800">{PROPERTY.car}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {PROPERTY.situacao}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-bold">{PROPERTY.bioma}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">APP: {PROPERTY.area_app}</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg font-bold">RL: {PROPERTY.reserva_legal}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-2">Pendências encontradas</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-rose-600">3</span>
                <span className="text-sm text-gray-500 mb-1">pendências</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md font-bold">2 Alta</span>
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md font-bold">1 Média</span>
              </div>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="mt-4 w-full text-sm font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "#0F5132" }}
              data-testid="button-gerar-relatorio"
            >
              <FileText className="w-4 h-4" /> Gerar Relatório Simplificado
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: "pendencias", label: "Pendências", icon: AlertTriangle },
              { key: "recomendacoes", label: "Recomendações", icon: CheckCircle2 },
              { key: "mapa", label: "Mapa da Área", icon: MapPin },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-[#0F5132] text-[#0F5132] bg-green-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Pendências */}
          {activeTab === "pendencias" && (
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-500">
                O CERES AI analisou o cadastro e identificou as seguintes pendências. Clique em cada uma para ver a explicação em linguagem simples.
              </p>
              {PENDENCIAS.map((p, i) => (
                <div key={i} className={`rounded-xl border transition-all overflow-hidden ${
                  p.nivel === "alta" ? "border-rose-200" : p.nivel === "media" ? "border-amber-200" : "border-blue-200"
                }`}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    data-testid={`button-pendencia-${i}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        p.nivel === "alta" ? "bg-rose-100" : p.nivel === "media" ? "bg-amber-100" : "bg-blue-100"
                      }`}>
                        <p.icon className={`w-4 h-4 ${
                          p.nivel === "alta" ? "text-rose-600" : p.nivel === "media" ? "text-amber-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.tipo}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          p.nivel === "alta" ? "bg-rose-100 text-rose-700" :
                          p.nivel === "media" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {p.nivel === "alta" ? "Prioridade Alta" : p.nivel === "media" ? "Prioridade Média" : "Baixa Prioridade"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedIdx === i ? "rotate-90" : ""}`} />
                  </button>

                  {expandedIdx === i && (
                    <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">Linguagem Técnica</span>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl leading-relaxed italic">{p.tecnico}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-md">Em linguagem simples</span>
                        </div>
                        <p className="text-sm text-gray-800 bg-green-50 p-3 rounded-xl leading-relaxed border border-green-100">{p.simples}</p>
                      </div>
                      <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800"><span className="font-bold">O que fazer:</span> {p.acao}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recomendações */}
          {activeTab === "recomendacoes" && (
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-500">
                Com base nas pendências identificadas, o CERES AI recomenda as seguintes ações para regularizar a propriedade.
              </p>
              {RECOMENDACOES.map((r, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.titulo}</p>
                    <p className="text-gray-600 text-sm mt-1">{r.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 mt-2">
                <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 text-sm">Benefícios da regularização</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Com o CAR regularizado, você pode acessar crédito rural com juros menores, participar de programas de financiamento agrícola, 
                    evitar multas ambientais e ter mais segurança jurídica na sua propriedade.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mapa */}
          {activeTab === "mapa" && (
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-4">Representação simplificada da área cadastrada. Em verde escuro: Reserva Legal. Em azul: APP (margem de rio e nascente).</p>
              <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 320 }}>
                {/* Simplified SVG map illustration */}
                <svg viewBox="0 0 600 320" className="w-full h-full" style={{ background: "#e8f5e9" }}>
                  {/* Base farm area */}
                  <polygon points="60,260 540,260 520,60 80,60" fill="#c8e6c9" stroke="#2E7D32" strokeWidth="2" />

                  {/* Reserva Legal (darker green) */}
                  <polygon points="400,260 520,260 520,140 430,120" fill="#2E7D32" opacity="0.8" />
                  <text x="465" y="210" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Reserva</text>
                  <text x="465" y="225" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Legal</text>

                  {/* APP river margin (blue) */}
                  <path d="M60,200 Q200,180 350,210 Q450,230 540,200" fill="#1976D2" opacity="0.3" strokeWidth="0" />
                  <path d="M60,215 Q200,195 350,225 Q450,245 540,215" fill="#1976D2" opacity="0.3" strokeWidth="0" />
                  <path d="M60,190 Q200,170 350,200 Q450,220 540,190" stroke="#1976D2" fill="none" strokeWidth="3" />
                  <text x="200" y="220" textAnchor="middle" fontSize="10" fill="#1565C0" fontWeight="bold">APP — Margem do Rio</text>

                  {/* Nascente */}
                  <circle cx="130" cy="170" r="12" fill="#1976D2" opacity="0.7" />
                  <text x="130" y="155" textAnchor="middle" fontSize="9" fill="#1565C0" fontWeight="bold">Nascente</text>

                  {/* Inconsistency area */}
                  <polygon points="270,200 340,195 330,225 265,230" fill="#dc2626" opacity="0.4" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,2" />
                  <text x="303" y="215" textAnchor="middle" fontSize="9" fill="#991b1b" fontWeight="bold">Pendência APP</text>

                  {/* Legend */}
                  <rect x="20" y="20" width="160" height="90" rx="6" fill="white" opacity="0.9" />
                  <rect x="30" y="32" width="12" height="12" rx="2" fill="#c8e6c9" stroke="#2E7D32" />
                  <text x="48" y="43" fontSize="10" fill="#374151">Área Total (48,5 ha)</text>
                  <rect x="30" y="50" width="12" height="12" rx="2" fill="#2E7D32" />
                  <text x="48" y="61" fontSize="10" fill="#374151">Reserva Legal (14,6%)</text>
                  <rect x="30" y="68" width="12" height="12" rx="2" fill="#1976D2" opacity="0.7" />
                  <text x="48" y="79" fontSize="10" fill="#374151">APP (6,2 ha)</text>
                  <rect x="30" y="86" width="12" height="12" rx="2" fill="#dc2626" opacity="0.5" />
                  <text x="48" y="97" fontSize="10" fill="#374151">Pendência</text>

                  {/* North arrow */}
                  <text x="540" y="288" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">N</text>
                  <line x1="540" y1="292" x2="540" y2="310" stroke="#374151" strokeWidth="1.5" markerEnd="url(#arr)" />
                </svg>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Mapa ilustrativo para fins demonstrativos. Dados reais são georreferenciados no SICAR.
              </p>
            </div>
          )}
        </div>

        {/* Report CTA */}
        <div className="rounded-2xl p-6 border border-green-200 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 font-display">Pronto para regularizar?</h3>
            <p className="text-gray-500 text-sm mt-1">
              Gere o relatório simplificado e leve para um técnico ou órgão ambiental do seu estado.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowReport(true)}
              className="px-6 py-3 text-sm font-bold text-white rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
              style={{ background: "#0F5132" }}
              data-testid="button-relatorio-final"
            >
              <Download className="w-4 h-4" /> Gerar Relatório
            </button>
            <button
              onClick={() => setLocation("/dashboard")}
              className="px-6 py-3 text-sm font-bold rounded-xl border-2 flex items-center gap-2 hover:bg-green-50 transition-all"
              style={{ borderColor: "#0F5132", color: "#0F5132" }}
              data-testid="button-falar-ia"
            >
              Falar com a IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
