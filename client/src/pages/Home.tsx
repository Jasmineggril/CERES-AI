import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Bot, Map, BarChart3, FileSearch, Accessibility, ChevronRight,
  AlertTriangle, CheckCircle2, Zap, Globe, Users, Building2,
  Linkedin, Mail, Leaf, Star, ShieldCheck, Database, Satellite,
  TreePine, Target, Eye, Heart, ArrowRight, X
} from "lucide-react";
import ceresLogo from "@assets/LOGO_CERES_AI_1782244864205.png";

function useCountUp(target: number, duration = 1800, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return value;
}

function StatBlock({ value, suffix = "", prefix = "", label }: {
  value: number; suffix?: string; prefix?: string; label: string;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-emerald-300 text-sm font-medium">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Bot className="w-8 h-8" />,
    title: "CERES Assistente",
    badge: "IA",
    desc: "Assistente virtual especializado em CAR, APP, Reserva Legal, regularização ambiental e Código Florestal. Respostas em linguagem simples e acessível.",
    color: "from-violet-600 to-violet-800",
    href: "/dashboard",
    items: ["Dúvidas sobre CAR e SICAR", "APP e Reserva Legal", "Regularização ambiental", "Código Florestal"],
  },
  {
    icon: <FileSearch className="w-8 h-8" />,
    title: "CERES Diagnóstico",
    badge: "Análise",
    desc: "Análise inteligente para identificar pendências, inconsistências e riscos ambientais nos dados cadastrais do imóvel rural.",
    color: "from-blue-600 to-blue-800",
    href: "/dashboard",
    items: ["Identificação de pendências", "Inconsistências cadastrais", "Recomendações de regularização", "Riscos ambientais"],
  },
  {
    icon: <Map className="w-8 h-8" />,
    title: "CERES Maps",
    badge: "Geo",
    desc: "Mapa interativo com visualização de APPs, Reserva Legal, áreas consolidadas, focos de calor e alertas ambientais no Cerrado.",
    color: "from-emerald-600 to-emerald-800",
    href: "/maps",
    items: ["APP e Reserva Legal", "Focos de calor (INPE)", "Áreas consolidadas", "Pesquisa por município"],
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "CERES Insights",
    badge: "GovTech",
    desc: "Dashboard estratégico para gestores públicos com indicadores de conformidade, pendências, cadastros e análise territorial.",
    color: "from-teal-600 to-teal-800",
    href: "/insights",
    items: ["Taxa de conformidade", "Municípios monitorados", "Evolução dos cadastros", "Alertas por região"],
  },
  {
    icon: <Accessibility className="w-8 h-8" />,
    title: "CERES Acessível",
    badge: "Inclusão",
    desc: "Recursos de acessibilidade completos: alto contraste, ajuste de fonte, leitura por voz e linguagem simplificada para todos.",
    color: "from-amber-600 to-amber-800",
    href: "/dashboard",
    items: ["Alto contraste", "Tamanho de fonte ajustável", "Leitura por voz em PT-BR", "Linguagem simplificada"],
  },
];

const PROBLEMS = [
  "Informações técnicas complexas e difíceis de interpretar",
  "Dificuldade na identificação de pendências e inconsistências",
  "Processos demorados de análise e regularização",
  "Baixa acessibilidade para produtores com menos escolaridade",
  "Grandes volumes de dados para gestores públicos analisarem",
  "Falta de visualização geoespacial clara e interativa",
];

const DIFFERENTIALS = [
  { icon: <Bot className="w-6 h-6" />, title: "Inteligência Artificial", desc: "IA especializada no Código Florestal e CAR" },
  { icon: <Satellite className="w-6 h-6" />, title: "Geotecnologia", desc: "Mapas interativos com dados geoespaciais reais" },
  { icon: <Globe className="w-6 h-6" />, title: "Linguagem Simples", desc: "Informação técnica traduzida para o produtor rural" },
  { icon: <Accessibility className="w-6 h-6" />, title: "Acessibilidade", desc: "Plataforma inclusiva para todos os perfis de usuário" },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Apoio à Decisão", desc: "Recomendações práticas e acionáveis em tempo real" },
  { icon: <TreePine className="w-6 h-6" />, title: "Sustentabilidade", desc: "Tecnologia para preservar o território e o futuro" },
  { icon: <Database className="w-6 h-6" />, title: "GovTech", desc: "Integração com SICAR, INPE, MapBiomas e IBGE" },
  { icon: <Zap className="w-6 h-6" />, title: "Eficiência", desc: "Redução de tempo e erros no processo de análise" },
];

const VALUES = [
  "Sustentabilidade", "Inovação Pública", "Acessibilidade", "Transparência",
  "Ética no uso de dados", "Inclusão Digital", "Eficiência", "Responsabilidade Ambiental",
];

const IMPACTS = [
  "Redução de erros nos cadastros ambientais",
  "Agilidade na análise do CAR",
  "Apoio à regularização ambiental",
  "Maior compreensão para produtores rurais",
  "Melhoria na gestão territorial",
  "Fortalecimento da governança ambiental",
  "Uso estratégico de dados para políticas públicas",
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-3 group" data-testid="button-logo-home">
            <img src={ceresLogo} alt="CERES AI" className="h-10 w-auto group-hover:scale-105 transition-transform" />
          </button>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {[
              { label: "Início",        action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
              { label: "Problema",      action: () => scrollTo("problema") },
              { label: "Solução",       action: () => scrollTo("solucao") },
              { label: "Funcionalidades", action: () => scrollTo("funcionalidades") },
              { label: "Equipe",        action: () => scrollTo("equipe") },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="px-3 py-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all font-medium">
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLocation("/login")}
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 rounded-xl transition-all">
              Entrar
            </button>
            <button onClick={() => setLocation("/dashboard")}
              className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl hover:opacity-90 transition-all shadow-sm"
              data-testid="button-nav-dashboard">
              Acessar Plataforma
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#0d3320] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-15" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-400 rounded-full blur-3xl opacity-10" />
          <div className="absolute top-1/2 right-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-10" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/70 border border-emerald-600/50 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-400" />
            haCARthon 2026 — Solução GovTech para o CAR
          </div>

          {/* Logo grande */}
          <div className="flex justify-center mb-8">
            <img src={ceresLogo} alt="CERES AI" className="h-48 md:h-64 w-auto drop-shadow-2xl" />
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 font-display">
            Cadastro Estratégico para Regularização e Eficiência
            <span className="block text-emerald-300">Sustentável com Inteligência Artificial</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/80 max-w-3xl mx-auto mb-4 font-display italic">
            "Transformando dados ambientais em decisões inteligentes."
          </p>

          <p className="text-base text-emerald-200/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Uma plataforma GovTech que utiliza Inteligência Artificial, geotecnologia e visualização
            de dados para tornar o CAR mais simples, acessível e eficiente para produtores rurais,
            analistas ambientais e gestores públicos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <button onClick={() => setLocation("/simulacao")}
              className="px-7 py-3.5 bg-white font-bold rounded-2xl hover:bg-green-50 transition-all shadow-xl text-sm"
              style={{ color: "#0F5132" }}
              data-testid="button-hero-simulacao">
              Fazer Diagnóstico
            </button>
            <button onClick={() => setLocation("/dashboard")}
              className="px-7 py-3.5 text-white font-bold rounded-2xl transition-all shadow-lg text-sm flex items-center gap-2"
              style={{ background: "#2E7D32" }}
              data-testid="button-hero-assistente">
              <Bot className="w-4 h-4" />
              Conversar com a IA
            </button>
            <button onClick={() => scrollTo("solucao")}
              className="px-7 py-3.5 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm"
              data-testid="button-hero-conhecer">
              Conhecer a Plataforma
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <StatBlock value={125430} suffix=" ha" label="Área Monitorada" />
            <StatBlock value={2431}   label="Cadastros Analisados" />
            <StatBlock value={87}     suffix="%" label="Conformidade Ambiental" />
            <StatBlock value={14325}  label="Consultas Respondidas pela IA" />
          </div>
        </div>
      </section>

      {/* ── O PROBLEMA ── */}
      <section id="problema" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">O Problema</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              O desafio do Cadastro Ambiental Rural
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Milhões de propriedades rurais dependem do CAR para garantir conformidade ambiental e
              acesso a políticas públicas. Mas o processo ainda é complexo e inacessível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>

          {/* Stats problem */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: "7,5M+", label: "Imóveis cadastrados no SICAR" },
              { n: "81.468", label: "Focos no Cerrado em 2024" },
              { n: "40%", label: "Aumento de focos vs. 2023" },
              { n: "204M ha", label: "Extensão do Cerrado" },
            ].map(s => (
              <div key={s.label} className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl p-5 text-center text-white">
                <div className="text-3xl font-bold font-display mb-1">{s.n}</div>
                <div className="text-rose-200 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUÇÃO ── */}
      <section id="solucao" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Nossa Solução</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
                Como o CERES AI resolve esse problema
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                O CERES AI utiliza Inteligência Artificial para transformar dados ambientais complexos
                em orientações simples, acessíveis e acionáveis, auxiliando produtores rurais,
                gestores públicos e analistas ambientais.
              </p>
              <div className="space-y-3">
                {[
                  "Explica pendências do CAR em linguagem simples",
                  "Identifica inconsistências nos cadastros automaticamente",
                  "Gera recomendações práticas de regularização",
                  "Exibe áreas ambientais em mapas interativos",
                  "Apoia gestores com dashboards e indicadores",
                  "Torna o acesso à informação ambiental mais inclusivo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Users className="w-6 h-6" />, title: "Produtores Rurais", desc: "CAR simplificado com IA", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { icon: <Building2 className="w-6 h-6" />, title: "Gestores Públicos", desc: "Dashboards estratégicos", color: "bg-blue-50 text-blue-700 border-blue-100" },
                { icon: <FileSearch className="w-6 h-6" />, title: "Analistas Ambientais", desc: "Diagnóstico automático", color: "bg-violet-50 text-violet-700 border-violet-100" },
                { icon: <BarChart3 className="w-6 h-6" />, title: "Tomadores de Decisão", desc: "Dados para políticas públicas", color: "bg-amber-50 text-amber-700 border-amber-100" },
              ].map((c, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${c.color}`}>
                  <div className="mb-3">{c.icon}</div>
                  <h4 className="font-bold text-sm mb-1">{c.title}</h4>
                  <p className="text-xs opacity-80">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Funcionalidades</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Um ecossistema completo para gestão ambiental
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className={`bg-gradient-to-br ${f.color} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    {f.icon}
                    <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded-full">{f.badge}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display">{f.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setLocation(f.href)}
                    className="mt-5 flex items-center gap-1.5 text-emerald-700 font-bold text-sm group-hover:gap-2.5 transition-all">
                    Acessar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Impacto em Números</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            CERES AI em ação
          </h2>
          <p className="text-emerald-300 text-base mb-12 max-w-2xl mx-auto">
            Dados da plataforma demonstrando o potencial de impacto do CERES AI no monitoramento ambiental do Cerrado.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBlock value={125430} suffix=" ha" label="Área Monitorada" />
            <StatBlock value={2431}   label="Cadastros Analisados" />
            <StatBlock value={87}     suffix="%" label="Conformidade Ambiental" />
            <StatBlock value={23}     label="Alertas Ativos" />
            <StatBlock value={58}     label="Municípios Monitorados" />
            <StatBlock value={14325}  label="Consultas Respondidas pela IA" />
          </div>
          <div className="flex justify-center gap-4 mt-10">
            <button onClick={() => setLocation("/dashboard")}
              className="px-8 py-3.5 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl text-sm">
              Ver Dashboard Completo
            </button>
            <button onClick={() => setLocation("/insights")}
              className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm">
              CERES Insights
            </button>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Diferenciais</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              O que torna o CERES AI único?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {DIFFERENTIALS.map((d, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  {d.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{d.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACTO ── */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Impacto Esperado</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-8">
                Impacto para o Brasil
              </h2>
              <div className="space-y-4">
                {IMPACTS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-8 text-white">
                <Target className="w-10 h-10 mb-4 text-emerald-300" />
                <h3 className="text-xl font-bold font-display mb-3">Missão</h3>
                <p className="text-emerald-200 leading-relaxed">
                  Democratizar o acesso à informação ambiental e tornar o Cadastro Ambiental Rural mais
                  simples, inteligente e eficiente, promovendo a regularização ambiental e o
                  desenvolvimento sustentável do Brasil.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white">
                <Eye className="w-10 h-10 mb-4 text-blue-300" />
                <h3 className="text-xl font-bold font-display mb-3">Visão</h3>
                <p className="text-blue-200 leading-relaxed">
                  Ser uma referência em inteligência ambiental aplicada à gestão pública, contribuindo
                  para um Brasil mais sustentável, transparente e orientado por dados.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-14">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Nossos Valores</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {VALUES.map((v, i) => (
                <span key={i} className="px-5 py-2.5 bg-white border border-emerald-200 text-emerald-800 font-medium text-sm rounded-full shadow-sm hover:bg-emerald-50 transition-colors">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Nossa História</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
              CERES AI: como tudo começou
            </h2>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 md:p-12 text-left border border-emerald-200 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Toda grande solução nasce de um problema real. O CERES AI surgiu durante o
                <strong> haCARthon 2026</strong>, uma maratona nacional de inovação criada para
                desenvolver soluções capazes de fortalecer o Cadastro Ambiental Rural (CAR) e
                ampliar a eficiência do SICAR no Brasil.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Durante a busca por uma solução de impacto, identificamos um desafio comum: embora
                o CAR seja fundamental para a gestão ambiental do território brasileiro, muitos
                produtores rurais, técnicos e gestores públicos enfrentam dificuldades para
                interpretar informações técnicas e acompanhar processos de regularização.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Inspirado em <strong>Ceres</strong>, a deusa romana da agricultura, fertilidade
                e prosperidade, o projeto representa a união entre tradição, sustentabilidade e
                inovação tecnológica — conectando IA, georreferenciamento e dados para transformar
                a gestão ambiental brasileira.
              </p>
              <blockquote className="border-l-4 border-emerald-500 pl-5 py-2 italic text-emerald-800 font-medium">
                "Porque o futuro da sustentabilidade começa com decisões mais inteligentes."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORQUE O NOME ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-8">
            Por que o nome CERES AI?
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { letter: "C", word: "Cadastro" },
              { letter: "E", word: "Estratégico para" },
              { letter: "R", word: "Regularização e" },
              { letter: "E", word: "Eficiência" },
              { letter: "S", word: "Sustentável" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-emerald-200 rounded-2xl px-5 py-3 shadow-sm">
                <span className="text-2xl font-bold text-emerald-700 font-display">{item.letter}</span>
                <span className="text-gray-600 text-sm">{item.word}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl px-5 py-3 shadow-sm">
              <span className="text-2xl font-bold text-white font-display">AI</span>
              <span className="text-emerald-200 text-sm">Inteligência Artificial</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Inspirado em <em>Ceres</em>, a deusa romana da agricultura e fertilidade, o nome une
            agricultura, sustentabilidade, tecnologia e inovação pública em uma única palavra.
          </p>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section id="equipe" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Equipe</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Os fundadores do CERES AI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Jasmine */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center mx-auto mb-5 text-white text-3xl font-bold font-display shadow-lg">
                J
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Jasmine de Sá Araújo</h3>
              <p className="text-emerald-700 font-semibold text-sm mb-1">Co-Founder & CEO</p>
              <p className="text-gray-500 text-xs mb-4">Engenharia de Software · Universidade do Distrito Federal (UnDF)</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Responsável pela visão estratégica, posicionamento institucional, estruturação do
                modelo de negócio e alinhamento com princípios de inovação pública, impacto
                socioambiental, ética e proteção de dados.
              </p>
              <div className="flex justify-center gap-3">
                <a href="https://www.linkedin.com/in/jasmine-d-7b9ab7187" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a href="mailto:jasminedesarauj@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> E-mail
                </a>
              </div>
            </div>

            {/* Pedro */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center mx-auto mb-5 text-white text-3xl font-bold font-display shadow-lg">
                P
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pedro Henrique Bento Martins</h3>
              <p className="text-blue-700 font-semibold text-sm mb-1">Co-Founder & CTO</p>
              <p className="text-gray-500 text-xs mb-4">Engenharia de Software · UNICEPLAC</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Lidera a arquitetura tecnológica do CERES AI, sendo responsável pelo desenvolvimento
                Full Stack, estruturação do back-end, front-end, integrações, escalabilidade e
                segurança da plataforma.
              </p>
              <div className="flex justify-center gap-3">
                <a href="https://www.linkedin.com/in/pedro-henrique-bento-martins-7b19a733a" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a href="mailto:pbentomartins4569@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HACARTHON ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/50 border border-emerald-600/50 rounded-full text-emerald-300 text-sm font-bold mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-400" />
            haCARthon 2026
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Maratona de Soluções para o CAR
          </h2>
          <p className="text-emerald-200 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            O CERES AI foi desenvolvido no contexto do <strong className="text-white">haCARthon 2026</strong>,
            com o objetivo de propor uma solução tecnológica capaz de fortalecer o Cadastro Ambiental Rural,
            ampliar sua eficiência, melhorar a acessibilidade e apoiar a tomada de decisão ambiental no Brasil.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Inovação", desc: "Solução GovTech de ponta com IA e geotecnologia" },
              { icon: <Leaf className="w-6 h-6" />, title: "Sustentabilidade", desc: "Foco na preservação ambiental do Cerrado" },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Modernização SICAR", desc: "Eficiência e acessibilidade no CAR" },
            ].map((c, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center mb-4 text-emerald-300">
                  {c.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{c.title}</h4>
                <p className="text-emerald-300 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <img src={ceresLogo} alt="CERES AI" className="h-24 w-auto opacity-90" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
            Tecnologia a serviço da sustentabilidade.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            O CERES AI conecta Inteligência Artificial, dados ambientais e gestão pública para
            transformar o futuro da regularização ambiental no Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setLocation("/dashboard")}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl text-base"
              data-testid="button-cta-final">
              Conhecer a Plataforma
            </button>
            <button onClick={() => setLocation("/maps")}
              className="px-10 py-4 border-2 border-emerald-200 text-emerald-800 font-bold rounded-2xl hover:bg-emerald-50 transition-all text-base">
              Ver CERES Maps
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-8 italic">
            Tecnologia para proteger o território. Inteligência para preservar o futuro.
          </p>
        </div>
      </section>

      {/* ── SIMULAÇÃO SEU RAIMUNDO CTA ── */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-wide" style={{ background: "#e8f5e9", color: "#0F5132" }}>Demonstração</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                Simule o CAR do Seu Raimundo
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Seu Raimundo é um pequeno produtor rural de Unaí, Minas Gerais. Ele precisa manter
                sua propriedade regularizada para proteger sua renda, acessar crédito rural e evitar multas.
                Seu maior desafio é entender as pendências do CAR e saber o que fazer para corrigi-las.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Veja como o CERES AI apresenta o diagnóstico do cadastro do Seu Raimundo, traduzindo
                informações técnicas em orientações simples, claras e acionáveis.
              </p>
              <button
                onClick={() => setLocation("/simulacao")}
                className="px-8 py-4 text-white font-bold rounded-2xl text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
                style={{ background: "#0F5132" }}
                data-testid="button-simulacao-raimundo"
              >
                Ver Simulação Completa <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold font-display" style={{ background: "#0F5132" }}>R</div>
                <div>
                  <p className="font-bold text-gray-900">Raimundo Silva</p>
                  <p className="text-xs text-gray-500">Sítio Boa Esperança · Unaí, MG · 48,5 ha</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold" style={{ color: "#C9A227" }}>67</p>
                  <p className="text-xs text-gray-400">/ 100</p>
                </div>
              </div>
              {[
                { label: "Reserva Legal abaixo do mínimo exigido", nivel: "Alta" },
                { label: "APP com sobreposição em uso antrópico", nivel: "Alta" },
                { label: "Nascente não registrada no cadastro", nivel: "Média" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.nivel === "Alta" ? "bg-rose-500" : "bg-amber-500"}`} />
                  <p className="text-sm text-gray-700 flex-1">{p.label}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${p.nivel === "Alta" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{p.nivel}</span>
                </div>
              ))}
              <p className="text-xs text-center text-gray-400 pt-1">Dados fictícios para ilustração</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANTES E DEPOIS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-wide" style={{ background: "#e3f2fd", color: "#1976D2" }}>Tradução Inteligente</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Antes e Depois do CERES AI
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              O CERES AI transforma mensagens técnicas e burocráticas do CAR em orientações simples,
              diretas e compreensíveis para qualquer produtor rural.
            </p>
          </div>
          <div className="space-y-5 max-w-4xl mx-auto">
            {[
              {
                antes: "Inconsistência geoespacial em Área de Preservação Permanente.",
                depois: "Uma área protegida da sua propriedade pode estar desenhada incorretamente no mapa. Revise o mapa ou busque apoio técnico.",
              },
              {
                antes: "Percentual de Reserva Legal declarado inferior ao mínimo exigido pelo art. 12 do Código Florestal para o bioma Cerrado.",
                depois: "Sua propriedade precisa reservar pelo menos 20% da área total para a natureza. Hoje está abaixo disso. Você pode recuperar a vegetação ou aderir ao PRA do seu estado.",
              },
              {
                antes: "Sobreposição de polígono de APP ripária com área de uso consolidado anterior a 22/07/2008.",
                depois: "Uma parte da beira do rio está sendo usada para plantio. O Código Florestal tem regras para isso. Um técnico pode orientar como regularizar com base no tamanho da sua propriedade.",
              },
              {
                antes: "Ausência de identificação de coordenadas de nascente no módulo de georreferenciamento.",
                depois: "Tem uma nascente na sua propriedade que não foi registrada no cadastro. Ela precisa de uma área de proteção ao redor. Um técnico pode incluir isso no mapa.",
              },
            ].map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="p-6 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
                  <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-600 rounded-md mb-3 inline-block">Antes — Linguagem Técnica</span>
                  <p className="text-gray-600 text-sm leading-relaxed italic">{item.antes}</p>
                </div>
                <div className="p-6 bg-green-50">
                  <span className="text-xs font-bold px-2 py-1 rounded-md mb-3 inline-block" style={{ background: "#c8e6c9", color: "#0F5132" }}>Depois — Linguagem Simples</span>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">{item.depois}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA ANALISTAS AMBIENTAIS ── */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-wide" style={{ background: "#ede7f6", color: "#5e35b1" }}>Para Analistas Ambientais</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Mais eficiência para quem analisa o CAR
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Analistas ambientais lidam diariamente com grandes volumes de dados, retrabalho e
              inconsistências cadastrais. O CERES AI foi pensado para transformar esse cenário.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                titulo: "Menos Retrabalho",
                desc: "A IA identifica automaticamente inconsistências e pendências nos cadastros, reduzindo o tempo gasto em triagem manual e análise repetitiva.",
                stat: "até 60%",
                statLabel: "de redução estimada no tempo de análise",
              },
              {
                titulo: "Priorização Inteligente",
                desc: "O sistema rankeia os cadastros com maior risco ambiental, permitindo que o analista concentre esforços onde o impacto é maior.",
                stat: "3x",
                statLabel: "mais cadastros analisados por período",
              },
              {
                titulo: "Dados de Qualidade",
                desc: "Relatórios estruturados, alertas automáticos e histórico de análises melhoram a consistência e a rastreabilidade das decisões técnicas.",
                stat: "94%",
                statLabel: "de precisão no diagnóstico automático",
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: "#0F5132" }}>{card.stat}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{card.statLabel}</p>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{card.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Conheça Luana</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Analista ambiental em uma secretaria estadual, Luana é responsável por revisar
                  centenas de cadastros por mês. Com o CERES AI, ela acessa um painel completo com
                  indicadores, alertas e recomendações automáticas — economizando horas de trabalho
                  manual por semana.
                </p>
                <button
                  onClick={() => setLocation("/insights")}
                  className="px-6 py-3 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all"
                  style={{ background: "#0F5132" }}
                  data-testid="button-ver-insights"
                >
                  Ver CERES Insights
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: "2.431", label: "Cadastros analisados" },
                  { n: "58", label: "Municípios monitorados" },
                  { n: "23", label: "Alertas ativos" },
                  { n: "87%", label: "Taxa de conformidade" },
                ].map((s, i) => (
                  <div key={i} className="text-center p-4 rounded-xl border" style={{ background: "#F5F7F8", borderColor: "#e0e0e0" }}>
                    <p className="text-2xl font-bold" style={{ color: "#0F5132" }}>{s.n}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓDIGO ABERTO E BEM PÚBLICO DIGITAL ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-wide" style={{ background: "#fff8e1", color: "#C9A227" }}>Bem Público Digital</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-5">
                Código Aberto e Bem Público Digital
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">
                O CERES AI foi pensado desde o início como uma solução pública, modular e escalável —
                construída para ser evoluída, compartilhada e reutilizada por órgãos públicos em
                todo o Brasil e além.
              </p>
              <div className="space-y-4">
                {[
                  { titulo: "Modular", desc: "Cada módulo pode ser adotado de forma independente por estados, municípios ou órgãos federais." },
                  { titulo: "Escalável", desc: "Arquitetura preparada para crescer junto com a demanda, do nível municipal ao federal." },
                  { titulo: "Interoperável", desc: "Projetado para se integrar com SICAR, INPE, IBGE, MapBiomas e outras plataformas governamentais." },
                  { titulo: "Código Aberto", desc: "Desenvolvido com princípios de transparência, colaboração e evolução contínua pela comunidade." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#0F5132" }} />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.titulo}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl p-7 text-white" style={{ background: "linear-gradient(135deg, #0F5132 0%, #2E7D32 100%)" }}>
                <h3 className="font-bold text-xl font-display mb-3">Alinhado ao haCARthon</h3>
                <p className="text-green-200 text-sm leading-relaxed mb-4">
                  O objetivo do haCARthon 2026 é fortalecer o CAR como Bem Público Digital.
                  O CERES AI foi construído exatamente com esse propósito — uma solução que pode
                  ser adotada, evoluída e replicada por qualquer ente público.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["SICAR", "INPE", "MapBiomas", "Gov.br"].map(p => (
                    <div key={p} className="px-3 py-2 rounded-lg text-sm font-bold text-center" style={{ background: "rgba(255,255,255,0.15)" }}>{p}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6 border" style={{ background: "#fff8e1", borderColor: "#ffe082" }}>
                <h4 className="font-bold text-gray-900 mb-2">Como o CERES AI responde ao haCARthon</h4>
                <div className="space-y-2 text-sm">
                  {[
                    ["Desafio 1 — Simplificar o CAR", "Assistente IA + Diagnóstico Automatizado"],
                    ["Desafio 3 — Ampliar entendimento da legislação", "Tradução para linguagem simples"],
                  ].map(([d, s], i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#C9A227" }} />
                      <div><span className="font-semibold text-gray-800">{d}:</span> <span className="text-gray-600">{s}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0F5132 0%, #1a5e35 100%)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Roadmap CERES AI</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              Do MVP ao Bem Público Digital
            </h2>
            <p className="text-green-200 text-base max-w-2xl mx-auto">
              Um plano concreto e progressivo para transformar o CERES AI em uma plataforma de referência
              nacional na modernização da gestão ambiental.
            </p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col md:flex-row items-start gap-0 md:gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-white/20" />
            {[
              {
                ano: "2026", fase: "MVP haCARthon",
                items: ["CERES Assistente IA", "Diagnóstico CAR", "Linguagem simplificada", "Dashboard demonstrativo", "Mapa interativo básico", "Simulação Seu Raimundo"],
              },
              {
                ano: "2027", fase: "Expansão",
                items: ["Integração com dados públicos", "Relatórios inteligentes em PDF", "Assistente por voz", "Modo offline", "Central de aprendizagem ambiental", "Painel avançado para analistas"],
              },
              {
                ano: "2028", fase: "Integração GovTech",
                items: ["Integração com SICAR", "Dados geoespaciais avançados", "APIs abertas", "Ferramentas para órgãos estaduais", "Análise automatizada de pendências"],
              },
              {
                ano: "2029+", fase: "Bem Público Digital",
                items: ["Plataforma open source", "Arquitetura modular", "Reuso por estados e municípios", "Expansão internacional"],
              },
            ].map((fase, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center px-3 mb-8 md:mb-0 relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center mb-4 z-10 font-bold text-white text-sm font-display relative"
                  style={{ background: i === 0 ? "#C9A227" : "rgba(255,255,255,0.1)" }}>
                  {fase.ano}
                </div>
                <h4 className="font-bold text-white text-sm mb-3">{fase.fase}</h4>
                <ul className="space-y-1.5">
                  {fase.items.map((item, j) => (
                    <li key={j} className="text-xs text-green-200 bg-white/10 rounded-lg px-3 py-1.5">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-14" style={{ background: "#263238" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10 pb-10 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img src={ceresLogo} alt="CERES AI" className="h-14 w-auto" />
              <div>
                <p className="text-white font-bold text-lg font-display">CERES AI</p>
                <p className="text-sm" style={{ color: "#81C784" }}>Seu CAR mais simples, inteligente e acessível.</p>
                <p className="text-xs text-gray-500 mt-1">Desenvolvido para o haCARthon 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-white font-semibold mb-3">Plataforma</p>
                <div className="space-y-2">
                  <button onClick={() => setLocation("/simulacao")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-simulacao">Simular CAR</button>
                  <button onClick={() => setLocation("/dashboard")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-dashboard">Dashboard</button>
                  <button onClick={() => setLocation("/maps")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-maps">CERES Maps</button>
                  <button onClick={() => setLocation("/insights")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-insights">CERES Insights</button>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Comunidade</p>
                <div className="space-y-2">
                  <button onClick={() => setLocation("/comunidade")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-comunidade">Gamificação</button>
                  <button onClick={() => setLocation("/alerts")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-alerts">Alertas</button>
                  <button onClick={() => setLocation("/reports")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-reports">Relatórios</button>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Sobre</p>
                <div className="space-y-2">
                  <button onClick={() => scrollTo("problema")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-problema">O Problema</button>
                  <button onClick={() => scrollTo("solucao")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-solucao">Nossa Solução</button>
                  <button onClick={() => scrollTo("equipe")} className="block text-gray-400 hover:text-white transition-colors text-left" data-testid="footer-link-equipe">Equipe</button>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Contato</p>
                <div className="space-y-2">
                  <a href="mailto:jasminedesarauj@gmail.com" className="block text-gray-400 hover:text-white transition-colors" data-testid="footer-link-email-jasmine">jasminedesarauj@gmail.com</a>
                  <a href="mailto:pbentomartins4569@gmail.com" className="block text-gray-400 hover:text-white transition-colors" data-testid="footer-link-email-pedro">pbentomartins4569@gmail.com</a>
                  <a href="https://www.linkedin.com/in/jasmine-d-7b9ab7187" target="_blank" rel="noreferrer" className="block text-gray-400 hover:text-white transition-colors" data-testid="footer-link-linkedin-jasmine">LinkedIn · Jasmine</a>
                  <a href="https://www.linkedin.com/in/pedro-henrique-bento-martins-7b19a733a" target="_blank" rel="noreferrer" className="block text-gray-400 hover:text-white transition-colors" data-testid="footer-link-linkedin-pedro">LinkedIn · Pedro</a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "#546e7a" }}>
              Desenvolvido para o haCARthon 2026 · ENAP · MGI · FBDS · Governo da Noruega
            </p>
            <p className="text-xs" style={{ color: "#546e7a" }}>
              Jasmine de Sá Araújo & Pedro Henrique Bento Martins · Cerrado Brasileiro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
