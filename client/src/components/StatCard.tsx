import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, trend, trendUp, className, delay = 0 }: StatCardProps) {
  return (
    <div 
      className={cn(
        // Adicionando sombra suave e bordas arredondadas do estilo premium
        "bg-card p-6 rounded-[1rem] border border-emerald-100 shadow-soft hover:shadow-lg transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Ícone agora usa a paleta verde musgo do PDF */}
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md",
            trendUp ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-emerald-900/60 text-xs uppercase tracking-widest font-bold mb-1">{title}</h3>
        <p className="text-3xl font-display font-bold text-emerald-950 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
