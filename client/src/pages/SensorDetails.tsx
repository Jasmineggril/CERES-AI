import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useSensor } from "@/hooks/use-sensors";
import { useReadings } from "@/hooks/use-readings";
import { Button } from "@/components/Button";
import { ArrowLeft, Clock, MapPin, Download } from "lucide-react";
import { Link } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format } from "date-fns";

export default function SensorDetails() {
  const [, params] = useRoute("/sensors/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: sensor, isLoading: loadingSensor } = useSensor(id);
  const { data: readings, isLoading: loadingReadings } = useReadings(id);

  if (loadingSensor || loadingReadings) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-secondary/50 w-1/3 rounded-lg" />
          <div className="h-64 bg-secondary/50 rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!sensor) return <Layout><div>Sensor not found</div></Layout>;

  // Format data for chart
  const chartData = readings?.map(r => ({
    time: format(new Date(r.timestamp || new Date()), 'HH:mm'),
    value: r.value,
    fullDate: r.timestamp
  })).reverse() || []; // Assuming API returns newest first

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/sensors" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Sensors
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">{sensor.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {sensor.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Last update: {sensor.lastPing ? format(new Date(sensor.lastPing), 'MMM d, HH:mm') : 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold font-display">Historical Readings ({sensor.type})</h2>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(146, 65%, 38%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(146, 65%, 38%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit={readings?.[0]?.unit || ""}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(146, 65%, 38%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Average</h3>
          <p className="text-2xl font-bold text-foreground">
            {chartData.length > 0 
              ? (chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length).toFixed(1)
              : 0
            }
            <span className="text-sm font-normal text-muted-foreground ml-1">{readings?.[0]?.unit}</span>
          </p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Max Recorded</h3>
          <p className="text-2xl font-bold text-foreground">
            {chartData.length > 0 ? Math.max(...chartData.map(d => d.value)).toFixed(1) : 0}
            <span className="text-sm font-normal text-muted-foreground ml-1">{readings?.[0]?.unit}</span>
          </p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Min Recorded</h3>
          <p className="text-2xl font-bold text-foreground">
            {chartData.length > 0 ? Math.min(...chartData.map(d => d.value)).toFixed(1) : 0}
            <span className="text-sm font-normal text-muted-foreground ml-1">{readings?.[0]?.unit}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
