import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAlerts, useResolveAlert } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, AlertTriangle, Info, AlertOctagon,
  Bell, Filter, Clock, MapPin, Wifi, WifiOff
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Alert } from "@shared/schema";

type FilterType = "todos" | "critical" | "medium" | "low" | "resolvidos";

const SEVERITY_CONFIG: Record<string, {
  label: string;
  icon: JSX.Element;
  cardClass: string;
  badgeClass: string;
  dotClass: string;
}> = {
  critical: {
    label: "Crítico",
    icon: <AlertOctagon className="w-5 h-5" />,
    cardClass: "border-l-4 border-l-rose-500 bg-rose-50/40",
    badgeClass: "bg-rose-100 text-rose-700 border border-rose-200",
    dotClass: "bg-rose-500",
  },
  medium: {
    label: "Médio",
    icon: <AlertTriangle className="w-5 h-5" />,
    cardClass: "border-l-4 border-l-amber-500 bg-amber-50/40",
    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
    dotClass: "bg-amber-500",
  },
  low: {
    label: "Baixo",
    icon: <Info className="w-5 h-5" />,
    cardClass: "border-l-4 border-l-blue-400 bg-blue-50/40",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
    dotClass: "bg-blue-400",
  },
};

function AlertCard({ alert, onResolve, isPending }: {
  alert: Alert;
  onResolve: (id: number) => void;
  isPending: boolean;
}) {
  const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.low;

  return (
    <div
      data-testid={`card-alert-${alert.id}`}
      className={cn(
        "rounded-2xl border border-border/50 p-5 shadow-sm transition-all duration-300",
        alert.isResolved
          ? "opacity-55 bg-card grayscale-[30%]"
          : cfg.cardClass
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
          alert.severity === "critical" ? "bg-rose-100 text-rose-600" :
          alert.severity === "medium"   ? "bg-amber-100 text-amber-600" :
                                          "bg-blue-100 text-blue-600"
        )}>
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground text-base leading-snug">{alert.title}</h3>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", cfg.badgeClass)}>
              {cfg.label}
            </span>
            {alert.isResolved && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Resolvido
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {alert.message}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {alert.createdAt
                ? format(new Date(alert.createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
                : "Data desconhecida"}
            </span>
            {alert.sensorId && (
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" />
                Sensor #{alert.sensorId}
              </span>
            )}
            {!alert.isResolved && (
              <span className={cn("flex items-center gap-1 font-medium", cfg.dotClass.replace("bg-", "text-"))}>
                <span className={cn("w-2 h-2 rounded-full animate-pulse", cfg.dotClass)} />
                Ativo
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        {!alert.isResolved && (
          <Button
            onClick={() => onResolve(alert.id)}
            disabled={isPending}
            variant="outline"
            size="sm"
            data-testid={`button-resolve-${alert.id}`}
            className="shrink-0 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200 self-start"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Resolver
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Alerts() {
  const { data: alertsData, isLoading } = useAlerts();
  const resolveAlert = useResolveAlert();
  const [filter, setFilter] = useState<FilterType>("todos");

  const total      = alertsData?.length ?? 0;
  const critical   = alertsData?.filter(a => a.severity === "critical" && !a.isResolved).length ?? 0;
  const pending    = alertsData?.filter(a => !a.isResolved).length ?? 0;
  const resolved   = alertsData?.filter(a => a.isResolved).length ?? 0;

  const filtered = alertsData?.filter(a => {
    if (filter === "todos")      return true;
    if (filter === "resolvidos") return a.isResolved;
    return a.severity === filter && !a.isResolved;
  }) ?? [];

  const FILTER_TABS: { key: FilterType; label: string; count: number }[] = [
    { key: "todos",      label: "Todos",     count: total },
    { key: "critical",   label: "Críticos",  count: critical },
    { key: "medium",     label: "Médios",    count: alertsData?.filter(a => a.severity === "medium" && !a.isResolved).length ?? 0 },
    { key: "low",        label: "Baixos",    count: alertsData?.filter(a => a.severity === "low" && !a.isResolved).length ?? 0 },
    { key: "resolvidos", label: "Resolvidos",count: resolved },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          Central de Alertas
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitoramento em tempo real de ocorrências ambientais no Cerrado Brasileiro.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total de Alertas",  value: total,    color: "text-foreground",    bg: "bg-card" },
          { label: "Críticos Ativos",   value: critical, color: "text-rose-600",      bg: "bg-rose-50" },
          { label: "Pendentes",         value: pending,  color: "text-amber-600",     bg: "bg-amber-50" },
          { label: "Resolvidos",        value: resolved, color: "text-emerald-600",   bg: "bg-emerald-50" },
        ].map(stat => (
          <div key={stat.label} className={cn("rounded-2xl border border-border/50 p-4 shadow-sm", stat.bg)}>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={cn("text-3xl font-bold font-display", stat.color)}>
              {isLoading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            data-testid={`filter-${tab.key}`}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              filter === tab.key
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-bold",
              filter === tab.key ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-secondary/40 rounded-2xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">Nenhum alerta nesta categoria</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "resolvidos" ? "Nenhum alerta foi resolvido ainda." : "Tudo aparenta estar normal por aqui."}
            </p>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={(id) => resolveAlert.mutate(id)}
              isPending={resolveAlert.isPending}
            />
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Exibindo {filtered.length} de {total} alertas · Atualizado automaticamente
        </p>
      )}
    </Layout>
  );
}
