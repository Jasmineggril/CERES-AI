import { Layout } from "@/components/Layout";
import { useAlerts } from "@/hooks/use-alerts";
import { useSensors } from "@/hooks/use-sensors";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FileCheck, AlertTriangle, TrendingUp, MapPin, Bell, Globe,
  Database, Satellite, TreePine, ShieldCheck, Activity, Clock
} from "lucide-react";

const MONTHLY_DATA = [
  { mes: "Jan", cadastros: 3240, pendencias: 890, conformes: 2350 },
  { mes: "Fev", cadastros: 3890, pendencias: 1020, conformes: 2870 },
  { mes: "Mar", cadastros: 4210, pendencias: 980, conformes: 3230 },
  { mes: "Abr", cadastros: 3750, pendencias: 850, conformes: 2900 },
  { mes: "Mai", cadastros: 4580, pendencias: 1140, conformes: 3440 },
  { mes: "Jun", cadastros: 5120, pendencias: 1320, conformes: 3800 },
  { mes: "Jul", cadastros: 4890, pendencias: 1200, conformes: 3690 },
  { mes: "Ago", cadastros: 5340, pendencias: 1400, conformes: 3940 },
  { mes: "Set", cadastros: 4720, pendencias: 1100, conformes: 3620 },
  { mes: "Out", cadastros: 5680, pendencias: 1560, conformes: 4120 },
  { mes: "Nov", cadastros: 6120, pendencias: 1680, conformes: 4440 },
  { mes: "Dez", cadastros: 6283, pendencias: 1756, conformes: 4527 },
];

const BIOME_DATA = [
  { name: "Cerrado", value: 48.2, color: "#16a34a" },
  { name: "Mata Atlântica", value: 22.7, color: "#0ea5e9" },
  { name: "Amazônia", value: 15.4, color: "#84cc16" },
  { name: "Caatinga", value: 8.9, color: "#f59e0b" },
  { name: "Outros", value: 4.8, color: "#8b5cf6" },
];

const SOURCES = [
  { name: "SICAR", desc: "Sistema Nacional do CAR", status: "Demo", icon: <FileCheck className="w-4 h-4" /> },
  { name: "INPE", desc: "Dados de focos de calor", status: "Demo", icon: <Satellite className="w-4 h-4" /> },
  { name: "MapBiomas", desc: "Cobertura e uso da terra", status: "Demo", icon: <TreePine className="w-4 h-4" /> },
  { name: "IBGE", desc: "Dados municipais e territoriais", status: "Demo", icon: <Globe className="w-4 h-4" /> },
];

const RECENT_ACTIVITY = [
  { time: "há 3 min", text: "47 novos cadastros CAR processados — GO", type: "success" },
  { time: "há 12 min", text: "Alerta de foco ativo — Chapada dos Veadeiros", type: "alert" },
  { time: "há 25 min", text: "Relatório de conformidade gerado — MT", type: "info" },
  { time: "há 1h", text: "Atualização do módulo preditivo v2.1 concluída", type: "info" },
  { time: "há 2h", text: "24 pendências CAR resolvidas em Formosa (GO)", type: "success" },
];

function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold font-display text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

export default function CeresInsights() {
  const { data: alertsData } = useAlerts();
  const { data: sensorsData } = useSensors();

  const activeAlerts = alertsData?.filter(a => !a.isResolved).length ?? 0;
  const activeSensors = sensorsData?.filter(s => s.status === "active").length ?? 0;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <BarChart className="w-8 h-8 text-primary" />
          CERES Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Dashboard GovTech — Indicadores ambientais e de conformidade do CAR no Cerrado Brasileiro.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Dados simulados para demonstração · Integração SICAR/INPE em desenvolvimento</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KpiCard
          icon={<FileCheck className="w-5 h-5 text-white" />}
          label="Cadastros Analisados"
          value="47.823"
          sub="+12% este mês"
          color="bg-emerald-500"
        />
        <KpiCard
          icon={<AlertTriangle className="w-5 h-5 text-white" />}
          label="Pendências CAR"
          value="12.456"
          sub="↓ 8% vs. mês anterior"
          color="bg-amber-500"
        />
        <KpiCard
          icon={<ShieldCheck className="w-5 h-5 text-white" />}
          label="Conformidade"
          value="73,8%"
          sub="Meta: 80% até dez/26"
          color="bg-blue-500"
        />
        <KpiCard
          icon={<MapPin className="w-5 h-5 text-white" />}
          label="Municípios"
          value="1.247"
          sub="Monitorados ativamente"
          color="bg-violet-500"
        />
        <KpiCard
          icon={<Bell className="w-5 h-5 text-white" />}
          label="Alertas Ativos"
          value={String(activeAlerts)}
          sub={`${activeSensors} sensores online`}
          color="bg-rose-500"
        />
        <KpiCard
          icon={<Globe className="w-5 h-5 text-white" />}
          label="Área Monitorada"
          value="156M ha"
          sub="Cerrado + entorno"
          color="bg-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Evolução Mensal de Cadastros CAR</h2>
          <p className="text-xs text-muted-foreground mb-5">Conformes vs. Pendências — Cerrado Central 2025/2026</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="colorConformes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPendencias" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(v: number, name: string) => [
                  v.toLocaleString("pt-BR"),
                  name === "conformes" ? "Conformes" : "Pendências"
                ]}
              />
              <Area type="monotone" dataKey="conformes" stroke="#16a34a" strokeWidth={2.5} fill="url(#colorConformes)" name="conformes" />
              <Area type="monotone" dataKey="pendencias" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorPendencias)" name="pendencias" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Biome Distribution Pie */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Distribuição por Bioma</h2>
          <p className="text-xs text-muted-foreground mb-4">Cadastros CAR por bioma (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={BIOME_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {BIOME_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Cadastros por Mês — 2025/2026</h2>
          <p className="text-xs text-muted-foreground mb-5">Total de imóveis cadastrados mensalmente</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(v: number) => [v.toLocaleString("pt-BR"), "Cadastros"]}
              />
              <Bar dataKey="cadastros" fill="#16a34a" radius={[6, 6, 0, 0]} name="Cadastros" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  a.type === "success" ? "bg-emerald-500" :
                  a.type === "alert"   ? "bg-rose-500 animate-pulse" : "bg-blue-400"
                }`} />
                <div>
                  <p className="text-xs text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Fontes de Dados — Integrações
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Estrutura preparada para integração com fontes oficiais brasileiras</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOURCES.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
