import { Layout } from "@/components/Layout";
import { useAlerts, useResolveAlert } from "@/hooks/use-alerts";
import { Button } from "@/components/Button";
import { CheckCircle, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const resolveAlert = useResolveAlert();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-rose-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return "bg-rose-50 border-rose-100 text-rose-900";
      case 'medium': return "bg-amber-50 border-amber-100 text-amber-900";
      default: return "bg-blue-50 border-blue-100 text-blue-900";
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Alerts</h1>
          <p className="text-muted-foreground mt-1">System notifications and critical warnings.</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 bg-secondary/50 rounded-2xl animate-pulse" />)
        ) : (
          alerts?.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all duration-300",
                alert.isResolved ? "bg-card border-border/50 opacity-60" : "bg-white shadow-sm hover:shadow-md border-border"
              )}
            >
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className={cn("p-3 rounded-xl", getSeverityStyles(alert.severity))}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-foreground text-lg">{alert.title}</h3>
                    {alert.isResolved && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    Reported: {alert.createdAt ? format(new Date(alert.createdAt), 'MMM d, yyyy @ h:mm a') : 'Unknown'}
                  </p>
                </div>
              </div>

              {!alert.isResolved && (
                <Button 
                  onClick={() => resolveAlert.mutate(alert.id)}
                  disabled={resolveAlert.isPending}
                  variant="outline"
                  className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              )}
            </div>
          ))
        )}
        
        {alerts?.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <CheckCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-muted-foreground">No alerts found</h3>
            <p className="text-sm text-muted-foreground/70">Everything seems to be running smoothly.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
