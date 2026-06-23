import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Map, BarChart3, Bot, ShieldCheck, Leaf, Satellite,
  ChevronRight, Users, Building2, Database, Zap, Globe, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

function useCountUp(target: number, duration = 2000, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(Math.floor(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration, started]);
  return value;
}

function AnimatedStat({ value, label, suffix = "", prefix = "" }: {
  value: number; label: string; suffix?: string; prefix?: string;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-emerald-200 text-sm font-medium">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Map className="w-7 h-7" />,
    title: "CERES Maps",
    desc: "Mapa interativo do Cerrado com camadas de APP, Reserva Legal e áreas consolidadas. Pesquisa por município.",
    color: "from-emerald-500 to-emerald-700",
    href: "/maps",
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: "CERES Insights",
    desc: "Dashboard GovTech com indicadores de conformidade ambiental, pendências do CAR e métricas territoriais.",
    color: "from-blue-500 to-blue-700",
    href: "/insights",
  },
  {
    icon: <Bot className="w-7 h-7" />,
    title: "IA Especializada",
    desc: "Assistente treinado em Código Florestal, SICAR, Reserva Legal e APP. Respostas objetivas e educativas.",
    color: "from-violet-500 to-violet-700",
    href: "/",
  },
  {
    icon: <Satellite className="w-7 h-7" />,
    title: "Alertas em Tempo Real",
    desc: "Monitoramento contínuo de focos de incêndio, qualidade do ar e eventos ambientais no Cerrado.",
    color: "from-rose-500 to-rose-700",
    href: "/alerts",
  },
  {
    icon: <Database className="w-7 h-7" />,
    title: "Integração SICAR/INPE",
    desc: "Estrutura preparada para integração com SICAR, INPE, MapBiomas e IBGE. Dados ambientais centralizados.",
    color: "from-amber-500 to-amber-700",
    href: "/insights",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Regularização Guiada",
    desc: "Passo a passo para regularização ambiental do imóvel rural, com base no Código Florestal vigente.",
    color: "from-teal-500 to-teal-700",
    href: "/",
  },
];

const PRODUCER_BENEFITS = [
  "Cadastro CAR simplificado com assistência de IA",
  "Entenda seus direitos e deveres no Código Florestal",
  "Identifique áreas de APP e Reserva Legal no seu imóvel",
  "Receba alertas de risco ambiental na sua região",
  "Acompanhe o status da regularização em tempo real",
  "Acesse orientações sobre Programas de Regularização Ambiental (PRA)",
];

const MANAGER_BENEFITS = [
  "Painel centralizado de cadastros CAR por município",
  "Indicadores de conformidade e pendências em tempo real",
  "Análise territorial com camadas ambientais integradas",
  "Relatórios automáticos para prestação de contas",
  "Monitoramento de alertas ambientais regionais",
  "Integração futura com SICAR, INPE e MapBiomas",
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground font-display">CERES AI</span>
              <span className="ml-2 text-xs text-muted-foreground hidden md:inline">Registro Ambiental Rural Inteligente</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Painel
              </button>
            </Link>
            <Link href="/maps">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Mapa
              </button>
            </Link>
            <Link href="/insights">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Insights
              </button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setLocation("/login")}>Entrar</Button>
            <Button size="sm" onClick={() => setLocation("/signup")} data-testid="button-hero-signup">
              Cadastrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-amber-400" />
            haCARthon 2026 — Solução GovTech para o CAR
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight">
            Transformando dados
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              ambientais em decisões
            </span>
            inteligentes.
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            CERES AI é a plataforma que torna o Cadastro Ambiental Rural (CAR) mais acessível,
            transparente e eficiente — para produtores rurais, técnicos e gestores públicos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-8 h-12 text-base shadow-xl"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-explore"
            >
              <Globe className="w-5 h-5 mr-2" />
              Explorar Plataforma
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold px-8 h-12 text-base backdrop-blur-sm"
              onClick={() => setLocation("/maps")}
              data-testid="button-map"
            >
              <Map className="w-5 h-5 mr-2" />
              CERES Maps
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold px-8 h-12 text-base backdrop-blur-sm"
              onClick={() => setLocation("/insights")}
              data-testid="button-insights"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 border-t border-emerald-700/50">
            <AnimatedStat value={47823} label="Cadastros Analisados" />
            <AnimatedStat value={1247} label="Municípios Monitorados" />
            <AnimatedStat value={156} label="Milhões de ha Monitorados" suffix="M" />
            <AnimatedStat value={74} label="Taxa de Conformidade (%)" suffix="%" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
              Funcionalidades da Plataforma
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um ecossistema completo para gestão ambiental rural com inteligência artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Link key={i} href={f.href}>
                <div className="group bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Acessar <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
              Para quem é o CERES AI?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Produtores Rurais</h3>
                  <p className="text-muted-foreground text-sm">e técnicos ambientais</p>
                </div>
              </div>
              <ul className="space-y-3">
                {PRODUCER_BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Gestores Públicos</h3>
                  <p className="text-muted-foreground text-sm">e órgãos ambientais</p>
                </div>
              </div>
              <ul className="space-y-3">
                {MANAGER_BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Pronto para transformar a gestão ambiental?
          </h2>
          <p className="text-emerald-200 text-lg mb-10">
            CERES AI — Cadastro Estratégico para Regularização e Eficiência Sustentável com Inteligência Artificial
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-10 h-12 text-base"
              onClick={() => setLocation("/signup")}
            >
              Criar Conta Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold px-10 h-12 text-base"
              onClick={() => setLocation("/dashboard")}
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-4 h-4" />
          <span className="font-bold text-white">CERES AI</span>
        </div>
        <p className="text-emerald-600">
          Cadastro Estratégico para Regularização e Eficiência Sustentável com Inteligência Artificial
        </p>
        <p className="text-emerald-700 mt-2">haCARthon 2026 · Cerrado Brasileiro</p>
      </footer>
    </div>
  );
}
