import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Flame, Send } from "lucide-react";

export default function Denuncia() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de envio para o Supabase
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Denúncia Enviada!",
        description: "O foco foi registrado e aparecerá no Centro de Comando em instantes.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10">
        <header className="mb-8 text-center">
          <Flame className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Reportar Foco de Incêndio</h1>
          <p className="text-muted-foreground mt-2">Sua denúncia ajuda a proteger o Cerrado.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Localização (Descrição ou Coordenadas)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Ex: Próximo à entrada do Parque Nacional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Intensidade Observada</label>
            <select className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none">
              <option>Baixa (Apenas fumaça)</option>
              <option>Média (Fogo em arbustos)</option>
              <option>Crítica (Incêndio em copa de árvores)</option>
            </select>
          </div>

          <Button 
            disabled={loading}
            className="w-full py-6 text-lg font-bold bg-red-600 hover:bg-red-700 transition-all rounded-xl"
          >
            {loading ? "Enviando..." : "ENVIAR DENÚNCIA AGORA"}
            <Send className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </div>
    </Layout>
  );
}