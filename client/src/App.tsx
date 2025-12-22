import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Sensors from "@/pages/Sensors";
import SensorDetails from "@/pages/SensorDetails";
import Alerts from "@/pages/Alerts";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/sensors" component={Sensors} />
      <Route path="/sensors/:id" component={SensorDetails} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/settings" component={() => <div className="p-8 text-center text-muted-foreground">Settings Page Placeholder</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
