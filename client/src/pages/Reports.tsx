import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAlerts } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
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

  const sampleReports = filteredAlerts.length > 0 ? filteredAlerts : [
    {
      id: "RPT-001",
      title: "Diagnóstico CAR - Propriedade Central",
      message: "Pendências de Reserva Legal e sobreposição de uso do solo.",
      severity: "critical",
      isResolved: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "RPT-002",
      title: "Relatório Simplificado - Fazenda Verde",
      message: "Alerta de licença ambiental e declaração SICAR incompleta.",
      severity: "medium",
      isResolved: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const reports = sampleReports;

  const handleExportCSV = () => {
    const csv = [
      ["ID", "Relatório", "Resumo", "Prioridade", "Status", "Data"],
      ...reports.map(r => [
        r.id,
        r.title,
        r.message,
        r.severity,
        r.isResolved ? "Resolvido" : "Aberto",
        r.createdAt ? format(new Date(r.createdAt), "dd/MM/yyyy HH:mm") : "N/A",
      ]),
    ]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorios_ceres_ai_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const createPdf = (type: "completo" | "simplificado") => {
    const now = new Date();
    const lines = [
      "CERES AI — haCARthon 2026",
      "Relatório " + (type === "completo" ? "Completo" : "Simplificado"),
      "Data: " + format(now, "dd/MM/yyyy HH:mm"),
      "",
      "Nome da propriedade: Fazenda Modelo",
      "Município/UF: Alto Paraíso de Goiás / GO",
      "Score de conformidade: 78%",
      "Pendências encontradas: Reserva Legal, Área de Preservação Permanente, Declaração SICAR.",
      "Recomendações: Atualizar documentação, ajustar limites e regularizar APP.",
      "",
      "Assinatura: CERES AI — haCARthon 2026",
      "",
      "Dados simulados para demonstração.",
    ];

    const escapeText = (text: string) =>
      text.replace(/([\\()])/g, "\\$1");

    const bodyLines = lines.map((line, index) => {
      const y = 760 - index * 18;
      return `BT /F1 12 Tf 50 ${y} Td (${escapeText(line)}) Tj ET`;
    });

    const body = bodyLines.join("\n");
    const stream = `${body}\n`;
    const length = new TextEncoder().encode(stream).length;

    const pdfParts = [
      "%PDF-1.3\n",
      "1 0 obj << /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
      `4 0 obj << /Length ${length} >>\nstream\n${stream}endstream\nendobj\n`,
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    ];

    let offset = 0;
    const xrefEntries = ["0000000000 65535 f \n"];
    const bodies: string[] = [];

    for (const part of pdfParts) {
      const padded = String(offset).padStart(10, "0");
      xrefEntries.push(`${padded} 00000 n \n`);
      bodies.push(part);
      offset += new TextEncoder().encode(part).length;
    }

    const xrefStart = offset;
    const xref = `xref\n0 ${pdfParts.length + 1}\n${xrefEntries.join("")}`;
    const trailer = `trailer << /Size ${pdfParts.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    const pdf = pdfParts.join("") + xref + trailer;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
  };

  const stats = {
    total: reports.length,
    critical: reports.filter(r => r.severity === "critical").length,
    unresolved: reports.filter(r => !r.isResolved).length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Relatórios</h1>
            <p className="text-muted-foreground mt-1">Análise de alertas e eventos do sistema para o fluxo de demonstração do CERES AI.</p>
          </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportCSV} data-testid="button-export-csv">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => createPdf("completo")} variant="outline" data-testid="button-export-pdf-full">
            <FileText className="w-4 h-4 mr-2" />
            PDF Completo
          </Button>
          <Button onClick={() => createPdf("simplificado")} variant="outline" data-testid="button-export-pdf-simple">
            <FileText className="w-4 h-4 mr-2" />
            PDF Simplificado
          </Button>
        </div>
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

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Relatórios demonstrativos com dados simulados para acompanhar o MVP em apresentação e validação de negócio.
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
