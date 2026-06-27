import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Bot, Map, BarChart3, FileSearch, Accessibility, ChevronRight,
  AlertTriangle, CheckCircle2, Zap, Globe, Users, Building2,
  Linkedin, Mail, Leaf, Star, ShieldCheck, Database, Satellite,
  TreePine, Target, Eye, Heart, ArrowRight, X, Smartphone,
  Wifi, Clock, Menu, MapPin, TrendingUp, AlertCircle,
  Send, MessageSquare, Lock
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

function AnimatedStat({ value, suffix = "", prefix = "", label, color = "#0F5132" }: {
  value: number; suffix?: string; prefix?: string; label: string; color?: string;
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
    <div ref={ref} className="text-center p-8">
      <div className="text-4xl md:text-5xl font-bold font-display mb-2" style={{ color }}>
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
    </div>
  );
}

const AI_CHAT_DEMOS = [
  {
    q: "O que é Reserva Legal?",
    a: "Reserva Legal é uma área da propriedade rural que deve ser preservada com vegetação nativa, conforme o Código Florestal. No Cerrado, ela deve corresponder a pelo menos 20% da área total do imóvel.",
  },
  {
    q: "Como regularizar meu CAR?",
    a: "Identificamos 3 pendências no seu cadastro. O primeiro passo é corrigir a delimitação da Área de Preservação Permanente (APP). Posso mostrar exatamente qual área no mapa e quais são as opções para regularização.",
  },
  {
    q: "O que é APP?",
    a: "APP (Área de Preservação Permanente) são áreas protegidas ao redor de rios, nascentes, lagos e encostas. Na sua propriedade, a faixa mínima de proteção é de 30 metros em torno dos cursos d'água.",
  },
];

const DESAFIOS = [
  { icon: <FileSearch className="w-5 h-5" />, title: "Simplificação do CAR", desc: "Tornar o Cadastro Ambiental Rural mais acessível e compreensível para produtores rurais." },
  { icon: <Globe className="w-5 h-5" />, title: "Educação Ambiental", desc: "Facilitar o entendimento da legislação ambiental com linguagem simples e exemplos práticos." },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Apoio à Regularização", desc: "Orientar o produtor em cada passo da regularização ambiental de forma clara e estruturada." },
  { icon: <AlertTriangle className="w-5 h-5" />, title: "Redução de Erros", desc: "Identificar automaticamente inconsistências cadastrais antes que se tornem problemas graves." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Apoio a Analistas", desc: "Aumentar a eficiência dos analistas ambientais com diagnóstico automático e priorização." },
  { icon: <Smartphone className="w-5 h-5" />, title: "Inclusão Digital", desc: "Levar tecnologia ambiental a produtores rurais em regiões com baixa conectividade e escolaridade." },
];

const POR_QUE_AGORA = [
  { n: "8M+", label: "imóveis cadastrados no CAR no Brasil", icon: <Database className="w-5 h-5" /> },
  { n: "20%", label: "dos cadastros com alguma inconsistência", icon: <AlertCircle className="w-5 h-5" /> },
  { n: "204M ha", label: "de extensão do bioma Cerrado", icon: <TreePine className="w-5 h-5" /> },
  { n: "40%", label: "de aumento nos focos de calor em 2024", icon: <AlertTriangle className="w-5 h-5" /> },
  { n: "R$ 2B+", label: "liberados em crédito rural via CAR regularizado", icon: <TrendingUp className="w-5 h-5" /> },
  { n: "2026", label: "Modernização do SICAR em curso pelo MGI", icon: <Zap className="w-5 h-5" /> },
];

const IMPACTO_METRICAS = [
  { value: 40, suffix: "%", label: "menos erros cadastrais", color: "#0F5132" },
  { value: 60, suffix: "%", label: "menos dúvidas recorrentes", color: "#1976D2" },
  { value: 30, suffix: "%", label: "menos retrabalho dos analistas", color: "#C9A227" },
  { value: 50, suffix: "%", label: "mais compreensão da legislação", color: "#2E7D32" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeChatDemo, setActiveChatDemo] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans scroll-smooth">

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-transparent border-b border-white/10"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 group" data-testid="button-logo-home">
            <img src={ceresLogo} alt="CERES AI" className="h-9 w-auto" />
            <span className={`font-display font-bold text-base hidden sm:block transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>CERES AI</span>
          </button>

          <div className="hidden md:flex items-center gap-0.5 text-sm">
            {[
              { label: "Solução", id: "solucao" },
              { label: "Como funciona", id: "como-funciona" },
              { label: "Por que agora?", id: "por-que" },
              { label: "Equipe", id: "equipe" },
            ].map(item => (
              <button key={item.label} onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-2 rounded-lg transition-colors text-sm font-medium ${scrolled ? "text-gray-500 hover:text-gray-900" : "text-white/80 hover:text-white"}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setLocation("/login")}
              className={`hidden md:block px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${scrolled ? "text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 bg-white" : "text-white border-white/60 hover:border-white hover:bg-white/10"}`}
              data-testid="button-nav-login">
              Entrar
            </button>
            <button onClick={() => setLocation("/signup")}
              className={`px-4 py-2 text-sm font-bold rounded-xl hover:opacity-90 transition-all ${scrolled ? "text-white" : "text-green-900"}`}
              style={{ background: scrolled ? "#0F5132" : "#d4ffd4" }}
              data-testid="button-nav-signup">
              Criar conta
            </button>
            <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "hover:bg-gray-50" : "hover:bg-white/10"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className={`w-5 h-5 ${scrolled ? "text-gray-600" : "text-white"}`} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0F5132] px-5 py-4 space-y-1">
            {[{ label: "Solução", id: "solucao" }, { label: "Como funciona", id: "como-funciona" }, { label: "Por que agora?", id: "por-que" }, { label: "Equipe", id: "equipe" }].map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full text-left px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">{item.label}</button>
            ))}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button onClick={() => setLocation("/login")} className="flex-1 py-2.5 text-sm font-semibold text-white border border-white/50 rounded-xl">Entrar</button>
              <button onClick={() => setLocation("/signup")} className="flex-1 py-2.5 text-sm font-bold text-green-900 rounded-xl" style={{ background: "#d4ffd4" }}>Criar conta</button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-20 min-h-screen flex flex-col justify-center relative overflow-hidden" style={{ background: "#0F5132" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(46,125,50,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,162,39,0.15) 0%, transparent 50%)" }} />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-8 border" style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)", color: "#d4ffd4" }}>
                <Star className="w-3.5 h-3.5 text-amber-400" />
                haCARthon 2026 · GovTech para o CAR
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-[1.08] mb-6">
                Seu CAR<br />mais simples,<br />
                <span style={{ color: "#a8f5c0" }}>inteligente</span><br />
                e acessível.
              </h1>

              <p className="text-white/85 text-lg leading-relaxed mb-10 max-w-md">
                CERES AI transforma dados técnicos do Cadastro Ambiental Rural em orientações simples e acionáveis, usando Inteligência Artificial para qualquer produtor rural.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setLocation("/signup")}
                  className="px-7 py-3.5 bg-white font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg text-sm"
                  style={{ color: "#0F5132" }}
                  data-testid="button-hero-signup">
                  Criar conta gratuita
                </button>
                <button onClick={() => scrollTo("como-funciona")}
                  className="px-7 py-3.5 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2 border border-white/30 hover:bg-white/10"
                  data-testid="button-hero-ver">
                  Ver como funciona <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-10 text-white/60 text-sm">
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso seguro · Dados protegidos · LGPD</span>
              </div>
            </div>

            {/* Right — Chat Preview */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#2E7D32" }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-semibold">CERES Assistente</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-end">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium text-white max-w-[80%]" style={{ background: "#2E7D32" }}>
                      O que é Reserva Legal?
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#1a5e35" }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed flex-1" style={{ background: "rgba(255,255,255,0.1)", color: "#e8f5e9" }}>
                      Reserva Legal é a área da sua propriedade rural que deve ser preservada com vegetação nativa. No Cerrado, são pelo menos <strong className="text-white">20% da área total</strong> do imóvel.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium text-white max-w-[80%]" style={{ background: "#2E7D32" }}>
                      E APP?
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#1a5e35" }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed flex-1" style={{ background: "rgba(255,255,255,0.1)", color: "#e8f5e9" }}>
                      APP é a Área de Preservação Permanente — faixas protegidas ao redor de rios e nascentes. Na sua propriedade precisa de pelo menos <strong className="text-white">30m de proteção</strong>.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <input
                      readOnly
                      className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border border-white/20 bg-white/5 text-white/40 placeholder-white/30 cursor-default"
                      placeholder="Pergunte sobre seu CAR..."
                    />
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#C9A227" }}>
                      <Send className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              { n: "8M+", label: "Imóveis no CAR" },
              { n: "204M ha", label: "Cerrado monitorado" },
              { n: "87%", label: "Conformidade estimada" },
              { n: "14K+", label: "Consultas respondidas" },
            ].map((s, i) => (
              <div key={i} className="text-center py-6 px-4" style={{ background: "rgba(0,0,0,0.15)" }}>
                <div className="text-2xl font-bold text-white font-display">{s.n}</div>
                <div className="text-xs mt-1 text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IA SECTION ─── */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e8f5e9", color: "#0F5132" }}>Inteligência Artificial</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Como a IA ajuda você
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              A CERES AI transforma informações técnicas e complexas em orientações simples e acionáveis — na sua língua.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Questions list */}
            <div className="lg:col-span-2 space-y-3">
              {AI_CHAT_DEMOS.map((demo, i) => (
                <button
                  key={i}
                  onClick={() => setActiveChatDemo(i)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${activeChatDemo === i ? "border-green-300 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                  style={{ background: activeChatDemo === i ? "#f0faf0" : "#fafafa" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: activeChatDemo === i ? "#0F5132" : "#e0e0e0" }}>
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{demo.q}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Chat window */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100" style={{ background: "#0F5132" }}>
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">CERES Assistente</span>
                  <div className="ml-auto flex items-center gap-1.5 text-green-300 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Online
                  </div>
                </div>
                <div className="p-6 space-y-4" style={{ background: "#fafcfa", minHeight: 220 }}>
                  <div className="flex justify-end">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium text-white max-w-[80%]" style={{ background: "#0F5132" }}>
                      {AI_CHAT_DEMOS[activeChatDemo].q}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#0F5132" }}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed flex-1 bg-white border border-gray-100 text-gray-700 shadow-sm">
                      {AI_CHAT_DEMOS[activeChatDemo].a}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 bg-gray-50 cursor-default">
                      Crie sua conta para fazer sua pergunta...
                    </div>
                    <button onClick={() => setLocation("/signup")} className="px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 flex-shrink-0" style={{ background: "#0F5132" }}>
                      Acessar IA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POR QUE AGORA ─── */}
      <section id="por-que" className="py-24" style={{ background: "#F5F7F8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e3f2fd", color: "#1976D2" }}>Contexto</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Por que o CERES AI<br />é importante?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              O momento é agora. A modernização do CAR é uma prioridade nacional — e o CERES AI é a resposta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POR_QUE_AGORA.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f5e9", color: "#0F5132" }}>
                    {item.icon}
                  </div>
                  <span className="text-3xl font-bold font-display" style={{ color: "#0F5132" }}>{item.n}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESAFIOS ─── */}
      <section id="solucao" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#fff8e1", color: "#C9A227" }}>haCARthon 2026</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Desafios que estamos<br />resolvendo
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              O CERES AI foi construído para responder diretamente aos desafios do haCARthon 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESAFIOS.map((d, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-green-100 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: "#e8f5e9", color: "#0F5132" }}>
                  {d.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0F5132" }} />
                    {d.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANTES & DEPOIS ─── */}
      <section className="py-24" style={{ background: "#F5F7F8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e3f2fd", color: "#1976D2" }}>Tradução Inteligente</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Transformando burocracia<br />em compreensão
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              O CERES AI converte linguagem técnica do CAR em orientações que qualquer produtor rural entende.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                antes: "Inconsistência geoespacial detectada em Área de Preservação Permanente.",
                depois: "Uma área protegida da sua propriedade pode estar marcada incorretamente no mapa. Revise com um técnico.",
              },
              {
                antes: "Percentual de Reserva Legal declarado inferior ao mínimo exigido pelo art. 12 do Código Florestal para o bioma Cerrado.",
                depois: "Sua propriedade precisa ter pelo menos 20% da área total preservada com vegetação nativa. Você pode recuperar a vegetação ou aderir ao PRA do seu estado.",
              },
              {
                antes: "Sobreposição de polígono de APP ripária com área de uso consolidado anterior a 22/07/2008.",
                depois: "Uma parte da beira do rio está sendo usada para plantio. Um técnico pode orientar como regularizar com base no tamanho da sua propriedade.",
              },
              {
                antes: "Ausência de identificação de coordenadas de nascente no módulo de georreferenciamento.",
                depois: "Há uma nascente na sua propriedade que não foi registrada. Ela precisa de uma área de proteção ao redor — um técnico pode incluir isso no mapa.",
              },
            ].map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                  <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg mb-3 inline-block uppercase tracking-wide">Antes</span>
                  <p className="text-gray-500 text-sm leading-relaxed italic">"{item.antes}"</p>
                </div>
                <div className="p-6" style={{ background: "#f0faf0" }}>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg mb-3 inline-block uppercase tracking-wide" style={{ background: "#c8e6c9", color: "#0F5132" }}>Depois</span>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">"{item.depois}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES ─── */}
      <section id="funcionalidades" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e8f5e9", color: "#0F5132" }}>Plataforma</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Ecossistema completo<br />para gestão ambiental
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Bot className="w-6 h-6" />, title: "CERES Assistente", badge: "IA", desc: "Chatbot especializado em CAR, Reserva Legal e Código Florestal. Respostas simples e acionáveis.", href: "/dashboard" },
              { icon: <FileSearch className="w-6 h-6" />, title: "CERES Diagnóstico", badge: "Análise", desc: "Identificação automática de pendências e inconsistências no cadastro do imóvel rural.", href: "/dashboard" },
              { icon: <Map className="w-6 h-6" />, title: "CERES Maps", badge: "Geo", desc: "Mapa interativo com APPs, Reserva Legal, focos de calor e alertas no Cerrado.", href: "/maps" },
              { icon: <BarChart3 className="w-6 h-6" />, title: "CERES Insights", badge: "GovTech", desc: "Dashboard estratégico para gestores públicos com indicadores e análise territorial.", href: "/insights" },
            ].map((f, i) => (
              <div key={i} className="group rounded-2xl border border-gray-100 p-6 hover:border-green-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setLocation("/login")}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#e8f5e9", color: "#0F5132" }}>
                    {f.icon}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "#F5F7F8", color: "#546e7a" }}>{f.badge}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center gap-1.5 text-sm font-bold transition-all" style={{ color: "#0F5132" }}>
                  <Lock className="w-3.5 h-3.5" /> Acessar com login
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPACTO ESPERADO ─── */}
      <section className="py-24" style={{ background: "#0F5132" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "rgba(255,255,255,0.18)", color: "#d4ffd4" }}>Impacto Esperado</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-5">
              Resultados que<br />transformam
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Métricas projetadas com base no potencial de adoção da plataforma em escala nacional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {IMPACTO_METRICAS.map((m, i) => (
              <AnimatedStat key={i} value={m.value} suffix={m.suffix} label={m.label} color="#fff" />
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <TreePine className="w-6 h-6" />, t: "Preservação", d: "Mais áreas com vegetação nativa regularizada no CAR" },
              { icon: <Users className="w-6 h-6" />, t: "Inclusão", d: "Produtores rurais com menos escolaridade incluídos digitalmente" },
              { icon: <ShieldCheck className="w-6 h-6" />, t: "Governança", d: "Dados mais confiáveis para políticas públicas ambientais" },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white" style={{ background: "rgba(255,255,255,0.15)" }}>
                  {c.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{c.t}</h4>
                <p className="text-white/75 text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIMULAÇÃO ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e8f5e9", color: "#0F5132" }}>Demonstração</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
                Simule o CAR<br />do Seu Raimundo
              </h2>
              <p className="text-gray-500 text-lg mb-4 leading-relaxed">
                Seu Raimundo é um pequeno produtor rural de Unaí, MG. Veja como o CERES AI traduz as pendências do seu cadastro em orientações claras.
              </p>
              <button onClick={() => setLocation("/simulacao")}
                className="px-7 py-3.5 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                style={{ background: "#0F5132" }}
                data-testid="button-simulacao">
                Ver Simulação Completa <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold font-display" style={{ background: "#0F5132" }}>R</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Raimundo Silva</p>
                  <p className="text-xs text-gray-400">Sítio Boa Esperança · Unaí, MG · 48,5 ha</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: "#C9A227" }}>67</p>
                  <p className="text-xs text-gray-400">/ 100</p>
                </div>
              </div>
              {[
                { label: "Reserva Legal abaixo do mínimo exigido", nivel: "Alta" },
                { label: "APP com sobreposição em uso antrópico", nivel: "Alta" },
                { label: "Nascente não registrada no cadastro", nivel: "Média" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.nivel === "Alta" ? "bg-red-400" : "bg-amber-400"}`} />
                  <p className="text-sm text-gray-700 flex-1">{p.label}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${p.nivel === "Alta" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>{p.nivel}</span>
                </div>
              ))}
              <p className="text-xs text-center text-gray-300 pt-1">Dados fictícios para ilustração · haCARthon 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOBILE PREVIEW ─── */}
      <section className="py-24 overflow-hidden" style={{ background: "#F5F7F8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e8f5e9", color: "#0F5132" }}>Em breve · Mobile</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
                CERES AI<br />no seu celular
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                O futuro da plataforma inclui um aplicativo mobile para que produtores rurais possam consultar seu CAR, tirar dúvidas com a IA e receber alertas — de qualquer lugar, até sem internet.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <Wifi className="w-4 h-4" />, t: "Modo offline", d: "Acesso ao diagnóstico sem conexão à internet" },
                  { icon: <Bot className="w-4 h-4" />, t: "IA por voz", d: "Pergunte sobre seu CAR por áudio em português" },
                  { icon: <MapPin className="w-4 h-4" />, t: "Alertas por localização", d: "Receba avisos sobre sua propriedade em tempo real" },
                  { icon: <Clock className="w-4 h-4" />, t: "Prazos e lembretes", d: "Notificações sobre pendências e vencimentos do CAR" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#e8f5e9", color: "#0F5132" }}>
                      {f.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{f.t}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium">
                <Smartphone className="w-4 h-4" />
                Roadmap 2027 · iOS e Android
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-[48px] blur-2xl opacity-20" style={{ background: "#0F5132", transform: "scale(0.9) translateY(20px)" }} />

                {/* Phone frame */}
                <div className="relative w-72 rounded-[44px] overflow-hidden shadow-2xl border-8 border-gray-900" style={{ background: "#111" }}>
                  {/* Notch */}
                  <div className="flex justify-center pt-2 pb-1">
                    <div className="w-24 h-5 rounded-full" style={{ background: "#111" }} />
                  </div>

                  {/* Screen */}
                  <div style={{ background: "#0F5132", minHeight: 580 }}>
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-5 pt-1 pb-3 text-xs text-white/70">
                      <span>9:41</span>
                      <div className="flex gap-1.5">
                        <Wifi className="w-3 h-3" />
                        <span className="text-xs">●●●</span>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="px-5 pb-5">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-green-300 text-xs">Bom dia, Raimundo</p>
                          <p className="text-white font-bold text-lg font-display">CERES AI</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Score card */}
                      <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-white text-xs font-semibold">Pontuação CAR</p>
                          <span className="text-xs text-green-300 font-bold">Sítio Boa Esperança</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-5xl font-bold text-white font-display">67</span>
                          <div className="flex flex-col items-end gap-1 mb-1">
                            <span className="text-green-300 text-xs">/100</span>
                            <span className="text-amber-400 text-xs font-bold">⚠ Pendências</span>
                          </div>
                        </div>
                        <div className="mt-3 rounded-full overflow-hidden h-1.5 bg-white/20">
                          <div className="h-full rounded-full" style={{ width: "67%", background: "#C9A227" }} />
                        </div>
                      </div>

                      {/* Quick action */}
                      <div className="rounded-xl p-3.5 mb-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-semibold">Pergunte à IA</p>
                          <p className="text-green-300 text-xs">O que é Reserva Legal?</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/50" />
                      </div>

                      {/* Alert */}
                      <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: "rgba(201,162,39,0.2)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.3)" }}>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-semibold">3 pendências</p>
                          <p className="text-amber-300 text-xs">Toque para ver detalhes</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="flex justify-around py-4 px-3 border-t border-white/10">
                      {[
                        { icon: <BarChart3 className="w-5 h-5" />, label: "CAR" },
                        { icon: <Bot className="w-5 h-5" />, label: "IA" },
                        { icon: <Map className="w-5 h-5" />, label: "Mapa" },
                        { icon: <Users className="w-5 h-5" />, label: "Perfil" },
                      ].map((n, i) => (
                        <div key={i} className={`flex flex-col items-center gap-1 ${i === 0 ? "text-white" : "text-white/40"}`}>
                          {n.icon}
                          <span className="text-[9px]">{n.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARA ANALISTAS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#ede7f6", color: "#5e35b1" }}>Analistas Ambientais</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Mais eficiência<br />para quem analisa o CAR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: "60%", statLabel: "de redução estimada no tempo de análise", titulo: "Menos Retrabalho", desc: "A IA identifica automaticamente inconsistências e pendências, reduzindo triagem manual." },
              { stat: "3x", statLabel: "mais cadastros analisados por período", titulo: "Priorização Inteligente", desc: "O sistema rankeia cadastros por risco ambiental, concentrando esforços onde importa." },
              { stat: "94%", statLabel: "de precisão no diagnóstico automático", titulo: "Dados de Qualidade", desc: "Relatórios estruturados e histórico de análises melhoram a rastreabilidade das decisões." },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow" style={{ background: "#fafafa" }}>
                <div className="mb-5">
                  <span className="text-4xl font-bold font-display" style={{ color: "#0F5132" }}>{card.stat}</span>
                  <p className="text-xs text-gray-400 mt-1">{card.statLabel}</p>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{card.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CÓDIGO ABERTO ─── */}
      <section className="py-24" style={{ background: "#F5F7F8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#fff8e1", color: "#C9A227" }}>Bem Público Digital</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-5">
                Código Aberto<br />e escalável
              </h2>
              <p className="text-gray-500 mb-7 leading-relaxed">
                O CERES AI foi pensado como uma solução pública, modular e escalável — construída para ser evoluída e replicada por qualquer ente público no Brasil.
              </p>
              <div className="space-y-3">
                {[
                  { t: "Modular", d: "Cada módulo pode ser adotado de forma independente." },
                  { t: "Interoperável", d: "Integrado com SICAR, INPE, IBGE e MapBiomas." },
                  { t: "Código Aberto", d: "Desenvolvido com transparência e colaboração pública." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#0F5132" }} />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.t}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl p-7 text-white" style={{ background: "#0F5132" }}>
                <h3 className="font-bold text-lg font-display mb-3">Alinhado ao haCARthon 2026</h3>
                <p className="text-green-200 text-sm leading-relaxed mb-5">
                  Construído exatamente para fortalecer o CAR como Bem Público Digital — uma solução que pode ser adotada por qualquer ente público.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {["SICAR", "INPE", "MapBiomas", "Gov.br"].map(p => (
                    <div key={p} className="px-2 py-2 rounded-lg text-xs font-bold text-center" style={{ background: "rgba(255,255,255,0.15)" }}>{p}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6 border" style={{ background: "#fff8e1", borderColor: "#ffe082" }}>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Resposta aos desafios do haCARthon</h4>
                <div className="space-y-2">
                  {[
                    ["Desafio 1 — Simplificar o CAR", "Assistente IA + Diagnóstico Automatizado"],
                    ["Desafio 3 — Entendimento da legislação", "Tradução para linguagem simples"],
                  ].map(([d, s], i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
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

      {/* ─── EQUIPE ─── */}
      <section id="equipe" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "#e8f5e9", color: "#0F5132" }}>Fundadores</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-5">
              Conheça os Fundadores
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Dois engenheiros de software que uniram tecnologia e propósito para transformar o CAR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                initial: "J",
                name: "Jasmine de Sá Araújo",
                role: "Co-Founder & CEO",
                univ: "Engenharia de Software · UnDF",
                bio: "Responsável pela visão estratégica, posicionamento institucional e alinhamento do CERES AI com princípios de inovação pública, impacto socioambiental, ética e proteção de dados.",
                linkedin: "https://www.linkedin.com/in/jasmine-d-7b9ab7187",
                email: "jasminedesarauj@gmail.com",
                color: "#0F5132",
              },
              {
                initial: "P",
                name: "Pedro Henrique Bento Martins",
                role: "Co-Founder & CTO",
                univ: "Engenharia de Software · UNICEPLAC",
                bio: "Lidera a arquitetura tecnológica do CERES AI — Full Stack, back-end, front-end, integrações, escalabilidade e segurança da plataforma.",
                linkedin: "https://www.linkedin.com/in/pedro-henrique-bento-martins-7b19a733a",
                email: "pbentomartins4569@gmail.com",
                color: "#1976D2",
              },
            ].map((p, i) => (
              <div key={i} className="rounded-3xl border border-gray-100 p-8 hover:shadow-md transition-shadow" style={{ background: "#fafafa" }}>
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0 shadow-lg" style={{ background: p.color }}>
                    {p.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: p.color }}>{p.role}</p>
                    <p className="text-gray-400 text-xs">{p.univ}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{p.bio}</p>
                <div className="flex gap-3">
                  <a href={p.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ background: "#0077b5" }}>
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href={`mailto:${p.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
                    style={{ background: "#eeeeee" }}>
                    <Mail className="w-3.5 h-3.5" /> E-mail
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROADMAP ─── */}
      <section className="py-24" style={{ background: "#0F5132" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-widest" style={{ background: "rgba(255,255,255,0.18)", color: "#d4ffd4" }}>Roadmap CERES AI</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-5">
              Do MVP ao Bem Público Digital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { ano: "2026", fase: "MVP haCARthon", active: true, items: ["Assistente IA", "Diagnóstico CAR", "Linguagem simples", "Dashboard", "Mapa interativo", "Simulação"] },
              { ano: "2027", fase: "Expansão", active: false, items: ["App mobile", "Assistente por voz", "Modo offline", "Relatórios PDF", "Painel analistas"] },
              { ano: "2028", fase: "GovTech", active: false, items: ["Integração SICAR", "APIs abertas", "Ferramentas estaduais", "Análise automática"] },
              { ano: "2029+", fase: "Bem Público Digital", active: false, items: ["Open source", "Arquitetura modular", "Expansão nacional", "Reuso estadual"] },
            ].map((fase, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10" style={{ background: fase.active ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.07)" }}>
                <div className="text-xl font-bold font-display mb-1" style={{ color: fase.active ? "#C9A227" : "white" }}>{fase.ano}</div>
                <p className="text-white/60 text-xs font-bold mb-4 uppercase tracking-wider">{fase.fase}</p>
                <ul className="space-y-2">
                  {fase.items.map((item, j) => (
                    <li key={j} className="text-xs text-white/75 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <img src={ceresLogo} alt="CERES AI" className="h-20 w-auto mx-auto mb-8 opacity-90" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-5 leading-[1.1]">
            CERES AI
          </h2>
          <p className="text-xl text-gray-500 mb-3 font-display">
            Seu CAR mais simples, inteligente e acessível.
          </p>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Plataforma CERES AI oficial em <span className="font-semibold text-gray-600">ceres-ai-oficial.vercel.app</span>.<br />Tecnologia para proteger o território e inteligência para preservar o futuro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setLocation("/signup")}
              className="px-10 py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg text-base"
              style={{ background: "#0F5132" }}
              data-testid="button-cta-final">
              Conhecer a Plataforma
            </button>
            <button onClick={() => setLocation("/simulacao")}
              className="px-10 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-base">
              Ver Demonstração
            </button>
          </div>
          <p className="text-gray-300 text-sm mt-10">
            haCARthon 2026 · ENAP · MGI · Jasmine de Sá Araújo & Pedro Henrique Bento Martins
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-14 border-t border-gray-100" style={{ background: "#263238" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10 pb-10 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img src={ceresLogo} alt="CERES AI" className="h-12 w-auto" />
              <div>
                <p className="text-white font-bold text-base font-display">CERES AI</p>
                <p className="text-sm text-white/70">Seu CAR mais simples, inteligente e acessível.</p>
                <p className="text-xs text-gray-500 mt-1">haCARthon 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Plataforma</p>
                <div className="space-y-2">
                  {[{ label: "Simular CAR", path: "/simulacao" }, { label: "Dashboard", path: "/login" }, { label: "CERES Maps", path: "/login" }, { label: "CERES Insights", path: "/login" }].map(l => (
                    <button key={l.label} onClick={() => setLocation(l.path)} className="block text-gray-400 hover:text-white transition-colors text-xs text-left">{l.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Comunidade</p>
                <div className="space-y-2">
                  {[{ label: "Gamificação", path: "/login" }, { label: "Alertas", path: "/login" }, { label: "Relatórios", path: "/login" }].map(l => (
                    <button key={l.label} onClick={() => setLocation(l.path)} className="block text-gray-400 hover:text-white transition-colors text-xs text-left">{l.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Sobre</p>
                <div className="space-y-2">
                  {[{ label: "Solução", id: "solucao" }, { label: "Por que agora?", id: "por-que" }, { label: "Equipe", id: "equipe" }].map(l => (
                    <button key={l.label} onClick={() => scrollTo(l.id)} className="block text-gray-400 hover:text-white transition-colors text-xs text-left">{l.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Contato</p>
                <div className="space-y-2">
                  <a href="mailto:jasminedesarauj@gmail.com" className="block text-gray-400 hover:text-white transition-colors text-xs">Jasmine · CEO</a>
                  <a href="mailto:pbentomartins4569@gmail.com" className="block text-gray-400 hover:text-white transition-colors text-xs">Pedro · CTO</a>
                  <a href="https://www.linkedin.com/in/jasmine-d-7b9ab7187" target="_blank" rel="noreferrer" className="block text-gray-400 hover:text-white transition-colors text-xs">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "#546e7a" }}>
              © 2026 CERES AI · haCARthon · ENAP · MGI · FBDS
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
