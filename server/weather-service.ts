// Weather API Service for Cerrado region
// Using Open-Meteo API (free, no key required)

export interface WeatherForecast {
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainfall: number;
  pressure: number;
  uvIndex: number;
  condition: string;
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherForecast | null> {
  try {
    // Using Open-Meteo API - free weather API with no authentication required
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.append("latitude", latitude.toString());
    url.searchParams.append("longitude", longitude.toString());
    url.searchParams.append("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,uv_index,precipitation");
    url.searchParams.append("timezone", "America/Sao_Paulo");

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`Weather API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const current = data.current;

    // Map WMO weather codes to condition descriptions
    const condition = mapWeatherCode(current.weather_code);

    return {
      latitude,
      longitude,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: getWindDirection(current.wind_direction_10m),
      rainfall: current.precipitation || 0,
      pressure: current.pressure_msl,
      uvIndex: current.uv_index,
      condition,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Map WMO weather codes to descriptions
function mapWeatherCode(code: number): string {
  if (code === 0) return "sunny";
  if (code === 1 || code === 2) return "cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "foggy";
  if (code === 51 || code === 53 || code === 55) return "rainy";
  if (code === 61 || code === 63 || code === 65) return "rainy";
  if (code === 71 || code === 73 || code === 75) return "snowy";
  if (code === 77) return "snowy";
  if (code === 80 || code === 81 || code === 82) return "rainy";
  if (code === 85 || code === 86) return "snowy";
  if (code === 95 || code === 96 || code === 99) return "storm";
  return "unknown";
}

// Convert degrees to compass direction
function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Assess fire risk based on weather conditions
export function assessFireRisk(weather: WeatherForecast): {
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: string[];
} {
  const factors: string[] = [];
  let riskScore = 0;

  // Temperature risk (higher temp = higher risk)
  if (weather.temperature > 35) {
    riskScore += 3;
    factors.push(`Temperatura muito alta: ${weather.temperature}°C`);
  } else if (weather.temperature > 30) {
    riskScore += 2;
    factors.push(`Temperatura alta: ${weather.temperature}°C`);
  }

  // Humidity risk (lower humidity = higher risk)
  if (weather.humidity < 30) {
    riskScore += 3;
    factors.push(`Umidade muito baixa: ${weather.humidity}%`);
  } else if (weather.humidity < 50) {
    riskScore += 2;
    factors.push(`Umidade baixa: ${weather.humidity}%`);
  }

  // Wind risk
  if (weather.windSpeed > 25) {
    riskScore += 3;
    factors.push(`Vento forte: ${weather.windSpeed} km/h`);
  } else if (weather.windSpeed > 15) {
    riskScore += 1;
    factors.push(`Vento moderado: ${weather.windSpeed} km/h`);
  }

  // UV index risk
  if (weather.uvIndex > 10) {
    riskScore += 2;
    factors.push(`Índice UV muito alto: ${weather.uvIndex}`);
  }

  // Rainfall (reduces risk)
  if (weather.rainfall > 10) {
    riskScore -= 2;
    factors.push(`Chuva recente: ${weather.rainfall}mm`);
  }

  // Storm condition (mixed - can cause fires but also brings rain)
  if (weather.condition === "storm") {
    riskScore += 1;
    factors.push("Tempestade em desenvolvimento");
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  if (riskScore >= 8) {
    riskLevel = "critical";
  } else if (riskScore >= 5) {
    riskLevel = "high";
  } else if (riskScore >= 2) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  return { riskLevel, factors };
}
