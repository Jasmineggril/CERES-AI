import { useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Leaf } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function getResetErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: string }).message ?? "").toLowerCase();
    if (message.includes("user not found") || message.includes("no user found")) {
      return "Não encontramos uma conta com este e-mail.";
    }
    if (message.includes("invalid email") || message.includes("invalid input")) {
      return "E-mail inválido. Verifique e tente novamente.";
    }
    if (message.includes("missing environment variable") || message.includes("invalid api key") || message.includes("invalid url")) {
      return "A configuração do Supabase está incompleta. Verifique as variáveis de ambiente.";
    }
    if (message.includes("network")) {
      return "Erro de conexão. Tente novamente mais tarde.";
    }
  }

  return "Não foi possível enviar o link de redefinição. Tente novamente.";
}

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!email.trim()) {
      setError("Informe um e-mail para continuar.");
      return;
    }

    setLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        setError("Redefinição de senha não está disponível no momento. Faça login localmente ou tente novamente mais tarde.");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/login",
      });

      if (resetError) {
        console.error("Erro ao solicitar redefinição de senha:", resetError);
        setError(getResetErrorMessage(resetError));
        return;
      }

      setStatusMessage("Enviamos um link de redefinição para o seu e-mail. Verifique sua caixa de entrada.");
    } catch (err) {
      console.error("Erro ao solicitar redefinição de senha:", err);
      setError(getResetErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7F8" }}>
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 text-white" style={{ background: "#0F5132" }}>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-green-300 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>
        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-3">Redefinir Senha</h2>
          <p className="text-green-200 text-lg leading-relaxed mb-8">
            Enviaremos um e-mail para redefinir sua senha e recuperar o acesso ao CERES AI.
          </p>
        </div>
        <p className="text-green-400 text-xs">haCARthon 2026 · ENAP · MGI</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <button
          onClick={() => setLocation("/")}
          className="lg:hidden absolute top-6 left-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Início
        </button>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:justify-start justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#0F5132" }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">CERES AI</span>
          </div>

          <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Recuperar conta</h1>
          <p className="text-gray-500 text-sm mb-7">Digite seu e-mail para receber o link de redefinição.</p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-5">
              {error}
            </div>
          )}

          {statusMessage && (
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm mb-5 flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "#0F5132" }}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Lembrou a senha?{' '}
            <button
              onClick={() => setLocation("/login")}
              className="font-semibold hover:underline transition-colors"
              style={{ color: "#0F5132" }}
            >
              Voltar ao login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
