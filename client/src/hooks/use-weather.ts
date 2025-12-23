import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { api } from "@shared/routes";

export function useWeatherLatest() {
  return useQuery({
    queryKey: ["/api/weather/latest"],
    queryFn: async () => {
      const res = await fetch(api.weather.latest.path);
      if (!res.ok) return null;
      return await res.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}

export function useFetchWeather() {
  return useMutation({
    mutationFn: async (coords: { latitude: number; longitude: number }) => {
      return apiRequest("POST", api.weather.fetch.path, coords);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weather/latest"] });
    },
  });
}
