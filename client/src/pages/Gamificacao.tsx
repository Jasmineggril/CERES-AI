import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy, Star, Flame, Shield, Zap, Target, Award,
  Plus, MapPin, ChevronRight, Users, CheckCircle2,
  TreePine, AlertTriangle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface UserStats {
  id: number; userId: number; points: number; level: number;
  denunciasCount: number; achievement: string; lastActivity: string;
}
interface Denuncia {
  id: number; titulo: string; descricao: string; categoria: string;
  municipio: string | null; status: string; pontosAtribuidos: number; createdAt: string;
}

// ──────────────────────────────────────────────
// Static badge definitions
// ──────────────────────────────────────────────
const ALL_BADGES = [
  { id: "primeira_denuncia", name: "Primeira Denúncia", desc: "Reportou o primeiro incidente ambiental", icon: "🌱", color: "from-emerald-400 to-emerald-600", pts: 0 },
  { id: "protetor_cerrado",   name: "Protetor do Cerrado", desc: "5 denúncias verificadas",            icon: "🛡️", color: "from-blue-400 to-blue-600",    pts: 100 },
  { id: "guardiao_ambiental", name: "Guardião Ambiental",  desc: "Atingiu 300 pontos",                 icon: "⚔️", color: "from-violet-400 to-violet-600", pts: 300 },
  { id: "heroi_cerrado",      name: "Herói do Cerrado",    desc: "Atingiu 500 pontos",                 icon: "🏆", color: "from-amber-400 to-amber-600",   pts: 500 },
  { id: "mestre_ambiental",   name: "Mestre Ambiental",    desc: "Atingiu 1000 pontos",                icon: "👑", color: "from-rose-400 to-rose-600",     pts: 1000 },
  { id: "dez_denuncias",      name: "10 Denúncias",         desc: "Reportou 10 incidentes",             icon: "🔥", color: "from-orange-400 to-orange-600", pts: 0 },
];

const LEVEL_CONFIG = [
  { level: 1, name: "Iniciante",          color: "text-gray-600",   bg: "bg-gray-100",    min: 0,    max: 99 },
  { level: 2, name: "Observador",         color: "text-emerald-700",bg: "bg-emerald-100", min: 100,  max: 299 },
  { level: 3, name: "Protetor",           color: "text-blue-700",   bg: "bg-blue-100",    min: 300,  max: 499 },
  { level: 4, name: "Guardião",           color: "text-violet-700", bg: "bg-violet-100",  min: 500,  max: 999 },
  { level: 5, name: "Herói do Cerrado",   color: "text-amber-700",  bg: "bg-amber-100",   min: 1000, max: Infinity },
];

const CATEGORIA_MAP: Record<string, { label: string; icon: string; color: string }> = {
  queimada:     { label: "Queimada",       icon: "🔥", color: "text-rose-600 bg-rose-50 border-rose-200" },
  desmatamento: { label: "Desmatamento",   icon: "🌳", color: "text-amber-700 bg-amber-50 border-amber-200" },
  invasao:      { label: "Invasão",        icon: "🚧", color: "text-orange-700 bg-orange-50 border-orange-200" },
  poluicao:     { label: "Poluição",       icon: "💨", color: "text-purple-700 bg-purple-50 border-purple-200" },
  outro:        { label: "Outro",          icon: "📋", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

function getLevelInfo(pts: number) {
  return LEVEL_CONFIG.find(l => pts >= l.min && pts <= l.max) ?? LEVEL_CONFIG[0];
}

function getLevelProgress(pts: number) {
  const lvl = getLevelInfo(pts);
  if (lvl.max === Infinity) return 100;
  return Math.round(((pts - lvl.min) / (lvl.max - lvl.min + 1)) * 100);
}

function getBadgesEarned(stats: UserStats) {
  const pts = stats.points ?? 0;
  const dc  = stats.denunciasCount ?? 0;
  return ALL_BADGES.filter(b => {
    if (b.id === "primeira_denuncia")  return dc >= 1;
    if (b.id === "protetor_cerrado")   return dc >= 5;
    if (b.id === "dez_denuncias")      return dc >= 10;
    return pts >= b.pts;
  });
}

// ──────────────────────────────────────────────
// Denuncia Form
// ──────────────────────────────────────────────
function DenunciaForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ titulo: "", descricao: "", categoria: "queimada", municipio: "" });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/denuncias", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/denuncias"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-stats/me"] });
      toast({ title: "✅ Denúncia registrada!", description: "+50 pontos adicionados à sua conta." });
      onClose();
    },
    onError: () => toast({ title: "Erro ao enviar denúncia", variant: "destructive" }),
  });

  const field = (key: keyof typeof form, value: string) => setForm(p => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Nova Denúncia Ambiental
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-5 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Cada denúncia válida vale <strong>+50 pontos</strong> na sua conta!
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Título</label>
            <input
              value={form.titulo}
              onChange={e => field("titulo", e.target.value)}
              placeholder="Ex: Queimada no Setor Norte..."
              data-testid="input-denuncia-titulo"
              className="w-full px-4 py-2.5 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Categoria</label>
            <select
              value={form.categoria}
              onChange={e => field("categoria", e.target.value)}
              data-testid="select-denuncia-categoria"
              className="w-full px-4 py-2.5 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-background"
            >
              {Object.entries(CATEGORIA_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Município</label>
            <input
              value={form.municipio}
              onChange={e => field("municipio", e.target.value)}
              placeholder="Ex: Alto Paraíso, GO"
              data-testid="input-denuncia-municipio"
              className="w-full px-4 py-2.5 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={e => field("descricao", e.target.value)}
              placeholder="Descreva o incidente com o máximo de detalhes possíveis..."
              rows={4}
              data-testid="input-denuncia-descricao"
              className="w-full px-4 py-2.5 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none bg-background"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-3 border border-border/50 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate(form)}
              disabled={!form.titulo || !form.descricao || mutation.isPending}
              data-testid="button-denuncia-submit"
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
            >
              {mutation.isPending ? "Enviando..." : "Enviar Denúncia (+50 pts)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
// Simulated demo stats (shown when no auth)
const DEMO_STATS: UserStats = {
  id: 1, userId: 1, points: 380, level: 3,
  denunciasCount: 7, achievement: "guardião", lastActivity: new Date().toISOString(),
};

const DEMO_DENUNCIAS: Denuncia[] = [
  { id: 1, titulo: "Queimada ativa próxima à APP", descricao: "...", categoria: "queimada", municipio: "Alto Paraíso, GO", status: "verificado", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, titulo: "Desmatamento ilegal em reserva", descricao: "...", categoria: "desmatamento", municipio: "Formosa, GO", status: "pendente", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, titulo: "Foco de calor detectado", descricao: "...", categoria: "queimada", municipio: "Planaltina, DF", status: "resolvido", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 4, titulo: "Poluição no córrego", descricao: "...", categoria: "poluicao", municipio: "Paracatu, MG", status: "pendente", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: 5, titulo: "Invasão de área protegida", descricao: "...", categoria: "invasao", municipio: "Chapada dos Veadeiros, GO", status: "verificado", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: 6, titulo: "Queimada próxima a nascente", descricao: "...", categoria: "queimada", municipio: "Niquelândia, GO", status: "resolvido", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 518400000).toISOString() },
  { id: 7, titulo: "Corte irregular de vegetação nativa", descricao: "...", categoria: "desmatamento", municipio: "Goiás, GO", status: "pendente", pontosAtribuidos: 50, createdAt: new Date(Date.now() - 604800000).toISOString() },
];

const DEMO_LEADERBOARD = [
  { name: "Maria S.",   pts: 820, dc: 16, badge: "Herói do Cerrado",   avatar: "M" },
  { name: "João F.",    pts: 650, dc: 13, badge: "Herói do Cerrado",   avatar: "J" },
  { name: "Ana C.",     pts: 520, dc: 10, badge: "Herói do Cerrado",   avatar: "A" },
  { name: "Você",       pts: 380, dc: 7,  badge: "Guardião Ambiental", avatar: "V" },
  { name: "Carlos R.",  pts: 210, dc: 4,  badge: "Protetor",           avatar: "C" },
  { name: "Fernanda L.",pts: 145, dc: 3,  badge: "Observador",         avatar: "F" },
  { name: "Bruno T.",   pts: 80,  dc: 1,  badge: "Iniciante",          avatar: "B" },
];

export default function Gamificacao() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"perfil" | "denuncias" | "ranking">("perfil");

  const stats = DEMO_STATS;
  const denuncias = DEMO_DENUNCIAS;
  const lvl = getLevelInfo(stats.points ?? 0);
  const progress = getLevelProgress(stats.points ?? 0);
  const badges = getBadgesEarned(stats);
  const nextLvl = LEVEL_CONFIG.find(l => l.level === lvl.level + 1);
  const ptsToNext = nextLvl ? nextLvl.min - (stats.points ?? 0) : 0;

  const statusColor = (s: string) =>
    s === "resolvido" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    s === "verificado" ? "text-blue-700 bg-blue-50 border-blue-200" :
    "text-amber-700 bg-amber-50 border-amber-200";

  const statusLabel = (s: string) =>
    s === "resolvido" ? "✅ Resolvido" :
    s === "verificado" ? "🔍 Verificado" : "⏳ Pendente";

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <Layout>
      {showForm && <DenunciaForm onClose={() => setShowForm(false)} />}

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            CERES Comunidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Reporte incidentes ambientais, acumule pontos e proteja o Cerrado.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          data-testid="button-nova-denuncia"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-700 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg text-sm"
        >
          <Plus className="w-5 h-5" />
          Nova Denúncia (+50 pts)
        </button>
      </div>

      {/* Points Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 md:p-8 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar + Level */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold font-display shadow-xl">
                V
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-white rounded-full text-xs font-bold text-emerald-800">
                Nv {stats.level}
              </div>
            </div>
            <div>
              <p className="text-emerald-300 text-sm">Você é um</p>
              <h2 className="text-2xl font-bold font-display">{lvl.name}</h2>
              <p className="text-emerald-400 text-xs mt-0.5">
                {nextLvl ? `${ptsToNext} pts para ${nextLvl.name}` : "Nível máximo atingido! 🏆"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-white/20" />

          {/* Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold font-display text-amber-300">{(stats.points ?? 0).toLocaleString("pt-BR")}</div>
              <div className="text-emerald-300 text-xs">Pontos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-display text-white">{stats.denunciasCount ?? 0}</div>
              <div className="text-emerald-300 text-xs">Denúncias</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-display text-emerald-300">{badges.length}</div>
              <div className="text-emerald-300 text-xs">Conquistas</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-300">Progresso do nível</span>
              <span className="text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-secondary/50 p-1 rounded-2xl w-fit">
        {[
          { key: "perfil" as const, label: "Conquistas", icon: <Trophy className="w-4 h-4" /> },
          { key: "denuncias" as const, label: "Minhas Denúncias", icon: <AlertTriangle className="w-4 h-4" /> },
          { key: "ranking" as const, label: "Ranking", icon: <Users className="w-4 h-4" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-testid={`tab-${t.key}`}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Conquistas Tab ── */}
      {tab === "perfil" && (
        <div className="space-y-6">
          {/* Earned Badges */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Conquistas Desbloqueadas
              <span className="ml-auto text-sm text-muted-foreground font-normal">{badges.length}/{ALL_BADGES.length}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_BADGES.map(b => {
                const earned = badges.find(x => x.id === b.id);
                return (
                  <div key={b.id}
                    className={`rounded-2xl border p-5 text-center transition-all ${
                      earned
                        ? "bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm"
                        : "bg-gray-50 border-gray-100 opacity-50 grayscale"
                    }`}
                    data-testid={`badge-${b.id}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm`}>
                      {b.icon}
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">{b.name}</h4>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                    {earned && (
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-amber-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Conquistado!
                      </div>
                    )}
                    {!earned && b.pts > 0 && (
                      <p className="mt-2 text-xs text-gray-400">{b.pts} pts necessários</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to earn points */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Como Ganhar Pontos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: <AlertTriangle className="w-5 h-5 text-rose-500" />, action: "Registrar denúncia ambiental", pts: "+50 pts", bg: "bg-rose-50 border-rose-100" },
                { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, action: "Denúncia verificada pelo time", pts: "+25 pts", bg: "bg-emerald-50 border-emerald-100" },
                { icon: <Target className="w-5 h-5 text-blue-500" />, action: "Denúncia resolvida com ação", pts: "+30 pts", bg: "bg-blue-50 border-blue-100" },
                { icon: <Star className="w-5 h-5 text-amber-500" />, action: "Login diário na plataforma", pts: "+10 pts", bg: "bg-amber-50 border-amber-100" },
                { icon: <TreePine className="w-5 h-5 text-teal-500" />, action: "Completar perfil ambiental", pts: "+30 pts", bg: "bg-teal-50 border-teal-100" },
                { icon: <Shield className="w-5 h-5 text-violet-500" />, action: "Desbloquear conquista nova", pts: "+20 pts", bg: "bg-violet-50 border-violet-100" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.bg}`}>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm text-gray-700">{item.action}</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 shrink-0">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Denúncias Tab ── */}
      {tab === "denuncias" && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Minhas Denúncias ({denuncias.length})
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <Plus className="w-4 h-4" /> Nova Denúncia
            </button>
          </div>
          <div className="divide-y divide-border/30">
            {denuncias.map(d => {
              const cat = CATEGORIA_MAP[d.categoria] ?? CATEGORIA_MAP.outro;
              return (
                <div key={d.id} className="p-5 hover:bg-secondary/20 transition-colors" data-testid={`denuncia-${d.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm mb-1">{d.titulo}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(d.status)}`}>
                            {statusLabel(d.status)}
                          </span>
                          {d.municipio && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{d.municipio}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-amber-600 text-sm">+{d.pontosAtribuidos} pts</div>
                      <div className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Ranking Tab ── */}
      {tab === "ranking" && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              Ranking de Protetores do Cerrado
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Demonstração — ranking baseado em pontos e denúncias registradas
            </p>
          </div>
          <div className="divide-y divide-border/30">
            {DEMO_LEADERBOARD.map((user, i) => {
              const isMe = user.name === "Você";
              return (
                <div key={i}
                  className={`p-5 flex items-center gap-4 ${isMe ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-secondary/20"} transition-colors`}
                  data-testid={`rank-row-${i + 1}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-700" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2">
                      {user.name}
                      {isMe && <span className="text-xs text-primary font-normal bg-primary/10 px-2 py-0.5 rounded-full">Você</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.badge} · {user.dc} denúncias</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-amber-600">{user.pts.toLocaleString("pt-BR")}</div>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}
