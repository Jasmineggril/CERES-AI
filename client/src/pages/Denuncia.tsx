import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Flame, Send } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Importação importante para o banco

export default function Denuncia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estados para capturar o que o usuário digita
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ENVIO REAL PARA O SUPABASE
      const { error } = await supabase
        .from('alerts') // Nome da tabela que você criou
        .insert([
          { 
            title: title, 
            message: message, 
            severity: severity,
            isResolved: false 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Denúncia Enviada com Sucesso!",
        description: "O banco de dados foi atualizado e o alerta aparecerá no Dashboard.",
        variant: "default",
      });

      // Limpa o formulário
      setTitle("");
      setMessage("");

    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10">
        <header className="mb-8 text-center">
          <Flame className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-emerald-950 font-display">Reportar Foco de Incêndio</h1>
          <p className="text-muted-foreground mt-2">Dados enviados diretamente ao Centro de Comando via Supabase.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[1rem] border border-emerald-100 shadow-soft space-y-6">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">Título da Ocorrência</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: Fogo em mata fechada próximo à BR-020"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">Descrição / Localização</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
                placeholder="Descreva detalhes do local para os bombeiros..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">Intensidade (Gravidade)</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none"
            >
              <option value="low">Baixa (Apenas fumaça)</option>
              <option value="medium">Média (Fogo em arbustos)</option>
              <option value="critical">Crítica (Incêndio em copa de árvores)</option>
            </select>
          </div>

          <Button 
            disabled={loading}
            className="w-full py-6 text-lg font-bold bg-emerald-700 hover:bg-emerald-800 transition-all rounded-xl shadow-lg"
          >
            {loading ? "Processando no Banco..." : "REGISTRAR NO SUPABASE"}
            <Send className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </div>
    </Layout>
  );
}
