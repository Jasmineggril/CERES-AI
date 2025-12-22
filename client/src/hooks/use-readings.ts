import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useReadings(sensorId?: number) {
  return useQuery({
    queryKey: [api.readings.list.path, sensorId],
    queryFn: async () => {
      let url = api.readings.list.path;
      if (sensorId) {
        const params = new URLSearchParams({ sensorId: String(sensorId) });
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch readings");
      return api.readings.list.responses[200].parse(await res.json());
    },
  });
}
