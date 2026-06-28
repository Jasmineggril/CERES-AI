import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useSensors, useDeleteSensor } from "@/hooks/use-sensors";
import { useAlerts } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

export default function Admin() {
  const { data: sensors = [] } = useSensors();
  const { data: alerts = [] } = useAlerts();
  const deleteSensor = useDeleteSensor();

  const handleExportSensors = () => {
    const csv = [
      ["ID", "Nome", "Tipo", "Localização", "Status"],
      ...sensors.map(s => [s.id, s.name, s.type, s.location, s.status]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensores_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const activeAlerts = alerts.filter((alert) => !alert.isResolved).length;
  const diagnosticsCount = sensors.length + Math.max(1, Math.floor(alerts.length / 2));

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Gerenciar diagnósticos CAR, alertas e relatórios do CERES AI com foco em regularização ambiental.</p>
        </div>
        <Button onClick={handleExportSensors}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Diagnósticos
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Usuários cadastrados</p>
          <p className="mt-3 text-3xl font-bold text-foreground">{12 + sensors.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Perfis de produtores, analistas e gestores em demonstração.</p>
        </div>
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Diagnósticos realizados</p>
          <p className="mt-3 text-3xl font-bold text-foreground">{diagnosticsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Diagnósticos CAR e simulações de regularização em andamento.</p>
        </div>
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Alertas ambientais</p>
          <p className="mt-3 text-3xl font-bold text-foreground">{activeAlerts}</p>
          <p className="mt-2 text-sm text-muted-foreground">Pendências de conformidade e ações recomendadas para o CAR.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <h2 className="text-xl font-bold font-display mb-4">Gerenciar Diagnósticos CAR</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-left">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Propriedade/Diagnóstico</th>
                <th className="py-3 px-4 font-semibold">Tipo</th>
                <th className="py-3 px-4 font-semibold">Município</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map(sensor => (
                <tr key={sensor.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-3 px-4">{sensor.id}</td>
                  <td className="py-3 px-4 font-medium">{sensor.name}</td>
                  <td className="py-3 px-4">{sensor.type}</td>
                  <td className="py-3 px-4">{sensor.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sensor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {sensor.status === 'active' ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        if (confirm("Tem certeza que deseja remover este diagnóstico?")) {
                          deleteSensor.mutate(sensor.id);
                        }
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
