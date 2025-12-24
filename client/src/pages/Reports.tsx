import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAlerts } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

type AlertSeverity = 'critical' | 'medium' | 'low';
type FilterStatusType = 'all' | 'open' | 'resolved';

export default function Reports() {
  const { data: alerts = [] } = useAlerts();
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>("all");

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false;
    if (filterStatus !== "all") {
      const isResolved = filterStatus === "resolved";
      if (alert.isResolved !== isResolved) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const csv = [
      ["ID", "Título", "Mensagem", "Severidade", "Status", "Data"],
      ...filteredAlerts.map(a => [
        a.id,
        a.title,
        a.message,
        a.severity,
        a.isResolved ? "Resolvido" : "Aberto",
        a.createdAt ? format(new Date(a.createdAt), "dd/MM/yyyy HH:mm") : "N/A",
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_alertas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: filteredAlerts.length,
    critical: filteredAlerts.filter(a => a.severity === "critical").length,
    unresolved: filteredAlerts.filter(a => !a.isResolved).length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Relatórios</h1>
            <p className="text-muted-foreground mt-1">Análise de alertas e eventos do sistema</p>
          </div>
          <Button onClick={handleExportCSV} data-testid="button-export-csv">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Severidade</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                data-testid="select-severity"
              >
                <option value="all">Todas</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatusType)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                data-testid="select-status"
              >
                <option value="all">Todos</option>
                <option value="open">Abertos</option>
                <option value="resolved">Resolvidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <p className="text-muted-foreground text-sm">Total de Alertas</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <p className="text-muted-foreground text-sm">Críticos</p>
            <p className="text-3xl font-bold text-destructive mt-2">{stats.critical}</p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <p className="text-muted-foreground text-sm">Não Resolvidos</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{stats.unresolved}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Título</th>
                  <th className="px-6 py-4 text-left font-semibold">Mensagem</th>
                  <th className="px-6 py-4 text-left font-semibold">Severidade</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Nenhum alerta encontrado
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map(alert => (
                    <tr key={alert.id} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="px-6 py-4 font-medium">{alert.id}</td>
                      <td className="px-6 py-4 font-medium">{alert.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{alert.message}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                          alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`} data-testid={`severity-${alert.id}`}>
                          {alert.severity === 'critical' ? 'Crítica' : alert.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`} data-testid={`status-${alert.id}`}>
                          {alert.isResolved ? 'Resolvido' : 'Aberto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {alert.createdAt ? format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm") : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
