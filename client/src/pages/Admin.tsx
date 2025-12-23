import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useSensors, useDeleteSensor } from "@/hooks/use-sensors";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

export default function Admin() {
  const { data: sensors = [] } = useSensors();
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

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Gerenciar sensores e usuários do sistema</p>
        </div>
        <Button onClick={handleExportSensors}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Sensores
        </Button>
      </div>

      {/* Sensores */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <h2 className="text-xl font-bold font-display mb-4">Sensores Implantados ({sensors.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-left">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Nome</th>
                <th className="py-3 px-4 font-semibold">Tipo</th>
                <th className="py-3 px-4 font-semibold">Localização</th>
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
                      sensor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sensor.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        if (confirm("Tem certeza?")) {
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
