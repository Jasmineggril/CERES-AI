import { useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Leaf } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { authenticateLocally, writeStoredAuthSession } from "@/hooks/use-auth";

function getLoginErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: string }).message ?? "");
    if (message.toLowerCase().includes("email not confirmed") || message.toLowerCase().includes("email_not_confirmed")) {
      return "Confirme seu e-mail antes de entrar.";
    }
    if (message.toLowerCase().includes("invalid login credentials") || message.toLowerCase().includes("invalid credentials")) {
      return "E-mail ou senha incorretos.";
    }
    if (message.toLowerCase().includes("user not found")) {
      return "Usuário não encontrado. Crie uma conta para continuar.";
    }
    if (message.toLowerCase().includes("missing environment variable") || message.toLowerCase().includes("invalid api key") || message.toLowerCase().includes("invalid url")) {
      return "A configuração do Supabase está incompleta. Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.";
    }
    if (message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("rls")) {
      return "O acesso ao perfil foi bloqueado por uma política de segurança. Verifique as políticas do Supabase.";
    }
    if (message.toLowerCase().includes("profile") && message.toLowerCase().includes("not found")) {
      return "Não foi possível localizar o perfil do usuário.";
    }
  }

  return "Não foi possível entrar no momento.";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatusMessage("");

    try {
      if (!isSupabaseConfigured) {
        const localSession = authenticateLocally({ email, password, createIfMissing: false });
        if (!localSession) {
          setError("E-mail ou senha incorretos.");
          return;
        }

        writeStoredAuthSession(localSession);
        setStatusMessage("Login realizado com sucesso em modo local.");
        setLocation("/dashboard");
        return;
      }

      if (!supabase) {
        setError("A configuração do Supabase está incompleta.");
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const loginError = getLoginErrorMessage(error);
        if (loginError.includes("Supabase está incompleta") || loginError.includes("bloqueado por uma política de segurança")) {
          const localSession = authenticateLocally({ email, password, createIfMissing: false });
          if (localSession) {
            writeStoredAuthSession(localSession);
            setStatusMessage("Login realizado em modo local como fallback.");
            setLocation("/dashboard");
            return;
          }
        }
        setError(loginError);
        return;
      }

      if (!authData.user) {
        setError("Não foi possível abrir uma sessão válida para este usuário.");
        return;
      }

      writeStoredAuthSession({
        userId: authData.user.id,
        email: authData.user.email ?? email,
        name: authData.user.user_metadata?.full_name ?? authData.user.email?.split("@")[0] ?? email,
        source: "server",
      });

      setStatusMessage("Login realizado com sucesso.");
      setLocation("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setError(getLoginErrorMessage(error));
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
          data-testid="button-back-home-login"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>

        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-3">CERES AI</h2>
          <p className="text-green-200 text-lg leading-relaxed mb-8">
            Seu CAR mais simples, inteligente e acessível.
          </p>
          <div className="space-y-3">
            {[
              "Diagnóstico inteligente do CAR",
              "Linguagem simples para o produtor rural",
              "Mapas interativos com APP e Reserva Legal",
              "Assistente IA especializado",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-400 text-xs">haCARthon 2026 · ENAP · MGI</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <button
          onClick={() => setLocation("/")}
          className="lg:hidden absolute top-6 left-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          data-testid="button-back-home-mobile"
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

          <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Bem-vindo</h1>
          <p className="text-gray-500 text-sm mb-7">Entre com seus dados para acessar o painel</p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-5">
              {error}
            </div>
          )}

          {statusMessage && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm mb-5 flex items-start gap-2">
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm"
                placeholder="seu@email.com"
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm"
                placeholder="••••••••"
                required
                data-testid="input-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "#0F5132" }}
              data-testid="button-submit-login"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{" "}
            <button
              onClick={() => setLocation("/signup")}
              className="font-semibold hover:underline transition-colors"
              style={{ color: "#0F5132" }}
              data-testid="button-link-signup"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
