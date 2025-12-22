import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useSensors, useDeleteSensor } from "@/hooks/use-sensors";
import { Button } from "@/components/Button";
import { SensorForm } from "@/components/SensorForm";
import { Plus, Search, Filter, Trash2, MapPin, Activity } from "lucide-react";
import { Link } from "wouter";
import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";

export default function Sensors() {
  const { data: sensors, isLoading } = useSensors();
  const deleteSensor = useDeleteSensor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSensors = sensors?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Sensors</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your deployed sensor units.</p>
        </div>
        
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Deploy Sensor
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in" />
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-lg bg-card p-6 rounded-2xl shadow-2xl border border-border animate-in zoom-in-95 duration-200">
              <SensorForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search sensors by name or location..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/30 border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors?.map((sensor) => (
            <div 
              key={sensor.id} 
              className="group bg-card hover:bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if(confirm("Are you sure?")) deleteSensor.mutate(sensor.id);
                  }}
                  className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Link href={`/sensors/${sensor.id}`}>
                <div className="cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        sensor.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{sensor.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{sensor.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {sensor.location}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pt-4 border-t border-border/50">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        sensor.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sensor.status}
                      </span>
                      <span className="text-muted-foreground">
                        Last ping: {sensor.lastPing ? format(new Date(sensor.lastPing), 'HH:mm') : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
