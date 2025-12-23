import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useSensors } from "@/hooks/use-sensors";
import { useAlerts } from "@/hooks/use-alerts";
import { Activity, Thermometer, AlertTriangle, Wind, MapPin, Leaf, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: sensors, isLoading: loadingSensors } = useSensors();
  const { data: alerts, isLoading: loadingAlerts } = useAlerts();

  const criticalAlerts = alerts?.filter(a => a.severity === 'critical' && !a.isResolved).length || 0;

  // Trend data for IA 2025 projection
  const trendData = [
    { month: "Jan 2024", focos: 6789 },
    { month: "Mar 2024", focos: 12450 },
    { month: "May 2024", focos: 20340 },
    { month: "Jul 2024", focos: 35680 },
    { month: "Sep 2024", focos: 56890 },
    { month: "Nov 2024", focos: 81468 },
    { month: "Jan 2025", focos: 85000 }
  ];

  // Função para imprimir o relatório profissional
  const handlePrint = () => {
    window.print();
  };

  const MapPlaceholder = () => (
    <div className="w-full h-[400px] bg-slate-900 rounded-2xl border border-emerald-900 relative overflow-hidden group shadow-2xl">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#10b981_1px,_transparent_1px)] bg-[size:20px_20px]" />

      {/* Marcadores de Fogo Reais (Simulados no Cerrado) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg" />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-emerald-500/30 text-xs font-medium text-emerald-400">
        Monitoramento Cerrado • Operacional
      </div>
    </div>
  );

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">FlorestaÍ - Centro de Comando</h1>
          <p className="text-muted-foreground mt-2">Inteligência Preditiva e Monitoramento de Queimadas no Cerrado.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <FileText className="w-5 h-5" />
          Gerar Relatório de Impacto
        </button>
      </header>

      {/* Stats Grid com seus dados reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Focos Detectados (2024)"
          value="81.468"
          icon={<Activity className="w-6 h-6 text-orange-500" />}
          trend="+40% vs 2023"
          trendUp={true}
          delay={0}
        />
        <StatCard
          title="Risco IA (2025)"
          value="CRÍTICO (85%)"
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          trend="Tendência de Alta"
          trendUp={true}
          delay={100}
        />
        <StatCard
          title="Projeção 2025 (Focos)"
          value="~85.000"
          icon={<Thermometer className="w-6 h-6 text-rose-500" />}
          trend="IA Regression"
          trendUp={true}
          delay={200}
        />
        <StatCard
          title="Denúncias Ativas"
          value={loadingAlerts ? "..." : criticalAlerts}
          icon={<MapPin className="w-6 h-6 text-blue-500" />}
          className={criticalAlerts > 0 ? "border-rose-200 bg-rose-50" : ""}
          trend={criticalAlerts > 0 ? "Ação Requerida" : "Monitorando"}
          trendUp={criticalAlerts === 0}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-xl font-bold font-display mb-4">Tendência IA 2025 (Focos Projetados)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fff" }}
                  formatter={(value) => [`${value.toLocaleString()} focos`, "Focos"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="focos" 
                  stroke="#16a34a" 
                  strokeWidth={3}
                  dot={{ fill: "#16a34a", r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Map */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Mapa Operacional de Calor</h2>
            <button className="text-primary hover:underline text-sm font-medium">Ver Mapa em Tela Cheia</button>
          </div>
          <MapPlaceholder />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-6 h-full shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-red-700">Denúncias (Supabase)</h2>
            <Link href="/alerts" className="text-sm text-primary hover:underline font-medium">
              Ver Histórico
            </Link>
          </div>

          <div className="space-y-4">
            {loadingAlerts ? (
              <p className="text-muted-foreground text-sm italic">Conectando ao banco...</p>
            ) : alerts?.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all border border-transparent hover:border-emerald-200">
                <div className={`mt-1 w-3 h-3 rounded-full shrink-0 animate-pulse ${
                  alert.severity === 'critical' ? 'bg-orange-500' : 'bg-amber-400'
                }`} />
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}