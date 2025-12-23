import { useEffect } from "react";
import { useAlerts } from "./use-alerts";
import { useToast } from "./use-toast";

export function useAlertNotifications() {
  const { data: alerts, isLoading } = useAlerts();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading || !alerts) return;

    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.isResolved);
    
    if (criticalAlerts.length > 0) {
      const alert = criticalAlerts[0];
      toast({
        title: `🚨 ${alert.title}`,
        description: alert.message,
        variant: "destructive",
      });
    }
  }, [alerts, isLoading, toast]);
}
