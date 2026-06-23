import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Bot, Map, BarChart3, FileSearch, Accessibility, ChevronRight,
  AlertTriangle, CheckCircle2, Zap, Globe, Users, Building2,
  Linkedin, Mail, Leaf, Star, ShieldCheck, Database, Satellite,
  TreePine, Target, Eye, Heart, ArrowRight, X
} from "lucide-react";
import ceresLogo from "@assets/image_1782242804699.png";

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
            <button onClick={() => scrollTo("solucao")}
              className="px-7 py-3.5 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl text-sm"
              data-testid="button-hero-conhecer">
              Conhecer a Solução
            </button>
            <button onClick={() => setLocation("/dashboard")}
              className="px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-lg text-sm"
              data-testid="button-hero-dashboard">
              Acessar Dashboard
            </button>
            <button onClick={() => setLocation("/dashboard")}
              className="px-7 py-3.5 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm"
              data-testid="button-hero-assistente">
              <Bot className="w-4 h-4 inline mr-2" />
              Testar Assistente IA
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
                🌱 "Porque o futuro da sustentabilidade começa com decisões mais inteligentes."
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
            🌎 Tecnologia para proteger o território. Inteligência para preservar o futuro.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <img src={ceresLogo} alt="CERES AI" className="h-12 w-auto brightness-90" />
              <div>
                <p className="text-white font-bold text-lg font-display">CERES AI</p>
                <p className="text-gray-500 text-xs">Inteligência Ambiental para o Cadastro Rural</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scrollTo("problema")} className="text-sm hover:text-white transition-colors">Problema</button>
              <button onClick={() => scrollTo("solucao")} className="text-sm hover:text-white transition-colors">Solução</button>
              <button onClick={() => scrollTo("funcionalidades")} className="text-sm hover:text-white transition-colors">Funcionalidades</button>
              <button onClick={() => scrollTo("equipe")} className="text-sm hover:text-white transition-colors">Equipe</button>
              <button onClick={() => setLocation("/dashboard")} className="text-sm hover:text-white transition-colors">Dashboard</button>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              Transformando dados ambientais em decisões inteligentes.
            </p>
            <p className="text-gray-600 text-xs">
              Desenvolvido para o haCARthon 2026 · Cerrado Brasileiro · 
              Jasmine de Sá Araújo & Pedro Henrique Bento Martins
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
