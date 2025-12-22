import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSensor } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useSensors() {
  return useQuery({
    queryKey: [api.sensors.list.path],
    queryFn: async () => {
      const res = await fetch(api.sensors.list.path);
      if (!res.ok) throw new Error("Failed to fetch sensors");
      return api.sensors.list.responses[200].parse(await res.json());
    },
  });
}

export function useSensor(id: number) {
  return useQuery({
    queryKey: [api.sensors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.sensors.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch sensor");
      return api.sensors.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateSensor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSensor) => {
      const res = await fetch(api.sensors.create.path, {
        method: api.sensors.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create sensor");
      }
      return api.sensors.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sensors.list.path] });
      toast({ title: "Success", description: "Sensor created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSensor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.sensors.delete.path, { id });
      const res = await fetch(url, { method: api.sensors.delete.method });
      if (!res.ok) throw new Error("Failed to delete sensor");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sensors.list.path] });
      toast({ title: "Success", description: "Sensor deleted" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
