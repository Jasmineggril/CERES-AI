import { useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Leaf } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { authenticateLocally, writeStoredAuthSession } from "@/hooks/use-auth";

function isPasswordStrong(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function getSignupErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: string }).message ?? "").toLowerCase();
    if (message.includes("user already registered") || message.includes("already registered") || message.includes("duplicate")) {
      return "Este e-mail já está cadastrado. Faça login ou redefina sua senha.";
    }
    if (message.includes("invalid email") || message.includes("invalid input value") || message.includes("invalid login credentials")) {
      return "Verifique o e-mail e tente novamente.";
    }
    if (message.includes("password") && (message.includes("least") || message.includes("weak"))) {
      return "Use uma senha mais forte, com pelo menos 8 caracteres, letra maiúscula, letra minúscula, número e símbolo.";
    }
    if (message.includes("missing environment variable") || message.includes("invalid api key") || message.includes("invalid url")) {
      return "A configuração do Supabase está incorreta. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.";
    }
    if (message.includes("network")) {
      return "Erro de conexão. Tente novamente.";
    }
    if (message.includes("email rate limit") || message.includes("over_email_send_rate_limit")) {
      return "Não foi possível enviar o email de confirmação. Tente novamente em alguns minutos.";
    }
  }

  return "Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.";
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
      setError("As senhas não coincidem.");
      return;
    }
    if (!isPasswordStrong(formData.password)) {
      setError("Use uma senha mais forte, com pelo menos 8 caracteres, letra maiúscula, letra minúscula, número e símbolo.");
      return;
    }

    if (!formData.name.trim()) {
      setError("O nome completo é obrigatório.");
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
        console.error("Erro no cadastro Supabase:", authError);
        const rawMessage = String(authError.message ?? "").toLowerCase();
        const isConfigError = rawMessage.includes("missing environment variable") || rawMessage.includes("invalid api key") || rawMessage.includes("invalid url");

        if (isConfigError) {
          const localSession = authenticateLocally({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            createIfMissing: true,
          });
          if (localSession) {
            writeStoredAuthSession(localSession);
            setStatusMessage(
              "O Supabase não está totalmente disponível. Conta criada localmente e você pode entrar normalmente."
            );
            setLocation("/dashboard");
            return;
          }
        }

        setError(getSignupErrorMessage(authError));
        return;
      }

      const signupUser = authData.user ?? authData.session?.user;
      if (!signupUser) {
        console.error("Erro no cadastro: usuário não retornado", authData);
        const localSession = authenticateLocally({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          createIfMissing: true,
        });
        if (localSession) {
          writeStoredAuthSession(localSession);
          setStatusMessage("Conta criada localmente, mas não foi possível concluir o cadastro Supabase.");
          setLocation("/dashboard");
          return;
        }

        setError("Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: signupUser.id,
          email: formData.email,
          name: formData.name,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error("Erro ao salvar perfil:", profileError);
      }

      const needsConfirmation = !authData.session;
      if (needsConfirmation) {
        const localSession = authenticateLocally({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          createIfMissing: true,
        });

        if (localSession) {
          writeStoredAuthSession(localSession);
          setStatusMessage(
            "Conta criada com sucesso. Se o e-mail de confirmação não chegar, use o login local ou redefinição de senha."
          );
          setLocation("/dashboard");
          return;
        }

        setStatusMessage("Conta criada com sucesso. Verifique seu email para confirmar o cadastro.");
        return;
      }

      writeStoredAuthSession({
        userId: signupUser.id,
        email: signupUser.email ?? formData.email,
        name: signupUser.user_metadata?.full_name ?? formData.name,
        source: "server",
      });

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
