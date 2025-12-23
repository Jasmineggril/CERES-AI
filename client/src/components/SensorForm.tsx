import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSensorSchema, type InsertSensor } from "@shared/schema";
import { Button } from "./Button";
import { useCreateSensor } from "@/hooks/use-sensors";
import { X } from "lucide-react";

interface SensorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SensorForm({ onSuccess, onCancel }: SensorFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InsertSensor>({
    resolver: zodResolver(insertSensorSchema),
    defaultValues: {
      status: "active",
      type: "Temperatura",
    }
  });

  const createSensor = useCreateSensor();

  const onSubmit = (data: InsertSensor) => {
    createSensor.mutate(data, {
      onSuccess: () => onSuccess(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-display">Adicionar Novo Sensor</h2>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Sensor</label>
        <input
          {...register("name")}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          placeholder="ex. Unidade Floresta Norte 1"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <select
            {...register("type")}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
          >
            <option value="Temperatura">Temperatura</option>
            <option value="Umidade">Umidade</option>
            <option value="CO2">CO2</option>
            <option value="Câmera">Câmera</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="maintenance">Manutenção</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição da Localização</label>
        <input
          {...register("location")}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          placeholder="ex. Zona A, Árvore 42"
        />
        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude</label>
          <input
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude</label>
          <input
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={createSensor.isPending} className="flex-1">
          Criar Sensor
        </Button>
      </div>
    </form>
  );
}
