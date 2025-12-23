import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useSensors } from "@/hooks/use-sensors";
import { useAlerts } from "@/hooks/use-alerts";
import { Activity, Thermometer, AlertTriangle, Wind, MapPin, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Placeholder para Mapa
function MapPlaceholder() {
  return (
    <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700 border border-emerald-100 shadow-lg flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-600 rounded-full blur-3xl"></div>
      </div>
      <div className="text-center text-white z-10">
        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-70" />
        <p className="text-sm font-medium">Mapa Geolocalização - Cerrado Central</p>
        <p className="text-xs opacity-70 mt-1">Integração de Mapa em Desenvolvimento</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: sensors, isLoading: loadingSensors } = useSensors();
  const { data: alerts, isLoading: loadingAlerts } = useAlerts();
  const { toast } = useToast();

  // Real-time notifications
  useEffect(() => {
    if (isLoading || !alerts) return;
    const criticalAlert = alerts.find(a => a.severity === 'critical' && !a.isResolved);
    if (criticalAlert) {
      toast({
        title: criticalAlert.title,
        description: criticalAlert.message,
        variant: "destructive",
      });
    }
  }, [alerts, isLoading, toast]);

  const criticalAlerts = alerts?.filter(a => a.severity === 'critical' && !a.isResolved).length || 0;

  // Dados de tendência para projeção IA 2025
  const trendData = [
    { month: "Jan 24", focos: 6789 },
    { month: "Mar 24", focos: 12450 },
    { month: "Mai 24", focos: 20340 },
    { month: "Jul 24", focos: 35680 },
    { month: "Set 24", focos: 56890 },
    { month: "Nov 24", focos: 81468 },
    { month: "Jan 25", focos: 85000 }
  ];

  const handlePrint = () => window.print();

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">FlorestaI - Painel de Monitoramento</h1>
          <p className="text-muted-foreground mt-2 font-medium">Análise Preditiva de Focos no Cerrado Brasileiro</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <FileText className="w-5 h-5" />
          Gerar Relatório
        </button>
      </header>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Focos 2024"
          value="81.468"
          icon={<Activity className="w-6 h-6" />}
          trend="+40% vs 2023"
          trendUp={true}
        />
        <StatCard
          title="Risco 2025"
          value="CRÍTICO"
          icon={<AlertTriangle className="w-6 h-6" />}
          trend="85% de probabilidade"
          trendUp={true}
        />
        <StatCard
          title="Projeção IA"
          value="~85.000"
          icon={<Thermometer className="w-6 h-6" />}
          trend="Focos estimados"
          trendUp={true}
        />
        <StatCard
          title="Alertas Ativos"
          value={loadingAlerts ? "..." : criticalAlerts}
          icon={<MapPin className="w-6 h-6" />}
          trend={criticalAlerts > 0 ? "Ação requerida" : "Estável"}
          trendUp={criticalAlerts === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de Tendência */}
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

          {/* Mapa */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Mapa Operacional de Calor</h2>
            <button className="text-primary hover:underline text-sm font-medium">Tela Cheia</button>
          </div>
          <MapPlaceholder />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-6 h-full shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">Alertas Críticos</h2>
            <Link href="/alerts" className="text-primary hover:underline text-sm font-medium">
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