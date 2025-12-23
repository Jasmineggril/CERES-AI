import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, AlertTriangle } from "lucide-react";
import type { WeatherData } from "@shared/schema";

interface WeatherCardProps {
  data: WeatherData | null | undefined;
  isLoading?: boolean;
}

export function WeatherCard({ data, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm animate-pulse">
        <div className="h-8 bg-secondary/50 w-1/3 rounded-lg mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-secondary/50 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm text-center">
        <p className="text-muted-foreground">Carregando dados meteorológicos...</p>
      </div>
    );
  }

  const getWeatherIcon = () => {
    switch (data.condition) {
      case "rainy":
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      case "sunny":
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case "storm":
        return <AlertTriangle className="w-12 h-12 text-red-500" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-400" />;
    }
  };

  const getConditionLabel = () => {
    const conditions: Record<string, string> = {
      sunny: "Ensolarado",
      cloudy: "Nublado",
      rainy: "Chuvoso",
      storm: "Tempestade",
      foggy: "Nevoeiro"
    };
    return conditions[data.condition] || data.condition;
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
      <h2 className="text-xl font-bold font-display mb-6">Condições Meteorológicas Atuais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Overview */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Condição do Tempo</p>
            <p className="text-2xl font-bold text-foreground">{getConditionLabel()}</p>
            <p className="text-muted-foreground text-sm mt-2">
              Temp: <span className="font-semibold">{data.temperature}°C</span>
            </p>
          </div>
          {getWeatherIcon()}
        </div>

        {/* Risk Indicators */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Umidade</p>
              <p className="font-semibold">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Wind className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Vento</p>
              <p className="font-semibold">{data.windSpeed} km/h {data.windDirection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Pressão</p>
          <p className="text-lg font-bold text-foreground">{data.pressure} hPa</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">UV</p>
          <p className="text-lg font-bold text-foreground">{data.uvIndex}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Chuva</p>
          <p className="text-lg font-bold text-foreground">{data.rainfall}mm</p>
        </div>
      </div>
    </div>
  );
}
