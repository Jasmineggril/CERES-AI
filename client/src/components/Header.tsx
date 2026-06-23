import { useAuthStatus, useLogout } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import ceresLogo from "@assets/LOGO_CERES_AI_1782244864205.png";

export function Header() {
  const { data: user } = useAuthStatus();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <header className="bg-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 group"
            data-testid="button-header-logo"
            aria-label="Voltar para página inicial"
          >
            <img
              src={ceresLogo}
              alt="CERES AI"
              className="h-9 w-auto group-hover:scale-105 transition-transform"
            />
          </button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/login")}
              data-testid="button-login"
            >
              Entrar
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/signup")}
              data-testid="button-signup"
            >
              Cadastro
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 group"
          data-testid="button-header-logo"
          aria-label="Voltar para página inicial"
        >
          <img
            src={ceresLogo}
            alt="CERES AI"
            className="h-9 w-auto group-hover:scale-105 transition-transform"
          />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
            data-testid="button-profile-menu"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium truncate max-w-[150px]">{user.name}</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border/30">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={() => { setLocation("/"); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm"
                data-testid="button-home-menu"
              >
                Página Inicial
              </button>
              <button
                onClick={() => { setLocation("/admin"); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm"
                data-testid="button-admin-menu"
              >
                Painel Admin
              </button>
              <button
                onClick={() => { logout.mutate(); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-sm text-destructive flex items-center gap-2"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
