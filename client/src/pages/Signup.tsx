import { useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Leaf } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { authenticateLocally, writeStoredAuthSession } from "@/hooks/use-auth";

function getSignupErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: string }).message ?? "");
    if (message.toLowerCase().includes("user already registered") || message.toLowerCase().includes("already registered")) {
      return "Este e-mail já está cadastrado.";
    }
    if (message.toLowerCase().includes("password") && message.toLowerCase().includes("least")) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
      if (message.toLowerCase().includes("invalid api key") || message.toLowerCase().includes("invalid url") || message.toLowerCase().includes("missing environment variable")) {
      return "A configuração do Supabase está incorreta. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.";
    }
    if (message.toLowerCase().includes("email rate limit") || message.toLowerCase().includes("over_email_send_rate_limit")) {
      return "O limite de envio de e-mail de confirmação foi atingido. Você pode tentar novamente em alguns minutos ou usar o modo local de autenticação.";
    }
    if (message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("rls")) {
      return "Não foi possível criar o perfil por causa de uma política de segurança do Supabase.";
    }
    if (message.toLowerCase().includes("profiles") && message.toLowerCase().includes("does not exist")) {
      return "A tabela profiles ainda não existe no projeto Supabase.";
    }
  }

  return "Não foi possível criar a conta no momento.";
}

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const localSession = authenticateLocally({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          createIfMissing: true,
        });

        if (!localSession) {
          setError("Não foi possível criar a conta local.");
          return;
        }

        writeStoredAuthSession(localSession);
        setStatusMessage("Conta criada com sucesso em modo local. Redirecionando...");
        setLocation("/dashboard");
        return;
      }

      if (!supabase) {
        setError("A configuração do Supabase está incompleta.");
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
        },
      });

      if (authError) {
        const signupError = getSignupErrorMessage(authError);
        if (signupError.includes("limite de envio de e-mail") || signupError.includes("Supabase está incorreta")) {
          // fallback para modo local quando o Supabase estiver temporariamente indisponível
          const localSession = authenticateLocally({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            createIfMissing: true,
          });
          if (localSession) {
            writeStoredAuthSession(localSession);
            setStatusMessage("Cadastro criado localmente pelo fallback. Acesse /login para entrar.");
            setLocation("/dashboard");
            return;
          }
        }
        setError(signupError);
        return;
      }

      if (!authData.user) {
        const localSession = authenticateLocally({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          createIfMissing: true,
        });

        if (localSession) {
          writeStoredAuthSession(localSession);
          setStatusMessage(
            "O cadastro foi registrado localmente. Caso o Supabase não permita confirmação por e-mail, use login local ou tente novamente mais tarde."
          );
          setLocation("/dashboard");
          return;
        }

        setError("O cadastro não retornou um usuário válido.");
        return;
      }

      writeStoredAuthSession({
        userId: authData.user.id,
        email: authData.user.email ?? formData.email,
        name: authData.user.user_metadata?.full_name ?? formData.name,
        source: "server",
      });

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        name: formData.name,
      });

      if (profileError) {
        const message = String(profileError.message ?? "").toLowerCase();
        if (!message.includes("does not exist") && !message.includes("relation")) {
          console.error("Erro ao criar profile:", profileError);
          setError(getSignupErrorMessage(profileError));
          return;
        }
      }

      setStatusMessage("Conta criada com sucesso. Redirecionando...");
      setLocation("/dashboard");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError(getSignupErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7F8" }}>
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 text-white" style={{ background: "#0F5132" }}>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-green-300 hover:text-white transition-colors text-sm font-medium"
          data-testid="button-back-home-signup"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>
        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-3">Junte-se ao CERES AI</h2>
          <p className="text-green-200 text-lg leading-relaxed mb-8">
            Crie sua conta e comece a simplificar o Cadastro Ambiental Rural com Inteligência Artificial.
          </p>
          <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
            <p className="text-green-100 text-sm leading-relaxed italic">
              "O CERES AI foi desenvolvido para tornar o CAR mais acessível para produtores rurais,
              analistas ambientais e gestores públicos de todo o Brasil."
            </p>
            <p className="text-green-300 text-xs mt-3 font-medium">— Equipe CERES AI · haCARthon 2026</p>
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

          <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Criar Conta</h1>
          <p className="text-gray-500 text-sm mb-7">Cadastre-se para acessar o sistema CAR</p>

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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {[
              { label: "Nome completo", key: "name" as const, type: "text", placeholder: "Seu nome" },
              { label: "Email", key: "email" as const, type: "email", placeholder: "seu@email.com" },
              { label: "Senha", key: "password" as const, type: "password", placeholder: "••••••••" },
              { label: "Confirmar Senha", key: "confirmPassword" as const, type: "password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={formData[f.key]}
                  onChange={set(f.key)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm"
                  placeholder={f.placeholder}
                  required
                  data-testid={`input-${f.key}`}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "#0F5132" }}
              data-testid="button-submit-signup"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="font-semibold hover:underline transition-colors"
              style={{ color: "#0F5132" }}
              data-testid="button-link-login"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
