import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useSensors } from "@/hooks/use-sensors";
import { useAlerts } from "@/hooks/use-alerts";
import { Activity, Thermometer, AlertTriangle, Wind, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: sensors, isLoading: loadingSensors } = useSensors();
  const { data: alerts, isLoading: loadingAlerts } = useAlerts();

  const activeSensors = sensors?.filter(s => s.status === 'active').length || 0;
  const criticalAlerts = alerts?.filter(a => a.severity === 'critical' && !a.isResolved).length || 0;
  
  // Placeholder map component
  const MapPlaceholder = () => (
    <div className="w-full h-[400px] bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden group">
      {/* Decorative map elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#10b981_1px,_transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Fake terrain blobs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
      
      {/* Sensor Dots */}
      {sensors?.slice(0, 5).map((sensor, i) => (
        <div 
          key={sensor.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
          style={{ 
            top: `${30 + (i * 15) % 60}%`, 
            left: `${20 + (i * 20) % 70}%` 
          }}
        >
          <div className="relative">
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${sensor.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${sensor.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium">
              {sensor.name}
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-border/50 text-xs font-medium text-muted-foreground">
        Live Map View • North Sector
      </div>
    </div>
  );

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening in the forest today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Sensors"
          value={loadingSensors ? "..." : activeSensors}
          icon={<Activity className="w-6 h-6" />}
          trend="+2 new"
          trendUp={true}
          delay={0}
        />
        <StatCard
          title="Avg Temperature"
          value="24.5°C"
          icon={<Thermometer className="w-6 h-6" />}
          trend="-0.5°C"
          trendUp={true} // cooling is good in some contexts, but let's say stable
          delay={100}
        />
        <StatCard
          title="Air Quality (AQI)"
          value="42"
          icon={<Wind className="w-6 h-6" />}
          trend="Good"
          trendUp={true}
          delay={200}
        />
        <StatCard
          title="Critical Alerts"
          value={loadingAlerts ? "..." : criticalAlerts}
          icon={<AlertTriangle className="w-6 h-6" />}
          className={criticalAlerts > 0 ? "border-rose-200 bg-rose-50" : ""}
          trend={criticalAlerts > 0 ? "Action needed" : "All clear"}
          trendUp={criticalAlerts === 0}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Sensor Locations</h2>
            <button className="text-primary hover:underline text-sm font-medium">View Full Map</button>
          </div>
          <MapPlaceholder />
        </div>

        {/* Sidebar: Recent Alerts */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">Recent Alerts</h2>
            <Link href="/alerts" className="text-sm text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {loadingAlerts ? (
              <p className="text-muted-foreground text-sm">Loading alerts...</p>
            ) : alerts?.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  alert.severity === 'critical' ? 'bg-rose-500' : 
                  alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{alert.message}</p>
                  <span className="text-[10px] text-muted-foreground/70 mt-2 block">
                    {alert.createdAt ? format(new Date(alert.createdAt), 'MMM d, h:mm a') : 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
            {alerts?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-primary/40" />
                </div>
                <p className="text-sm">No active alerts. The forest is safe.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
