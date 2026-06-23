import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Sensors from "@/pages/Sensors";
import SensorDetails from "@/pages/SensorDetails";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CeresMaps from "@/pages/CeresMaps";
import CeresInsights from "@/pages/CeresInsights";
import Gamificacao from "@/pages/Gamificacao";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sensors" component={Sensors} />
      <Route path="/sensors/:id" component={SensorDetails} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/reports" component={Reports} />
      <Route path="/admin" component={Admin} />
      <Route path="/maps" component={CeresMaps} />
      <Route path="/insights" component={CeresInsights} />
      <Route path="/comunidade" component={Gamificacao} />
      <Route path="/settings" component={() => <div className="p-8 text-center text-muted-foreground">Página de Configurações em Desenvolvimento</div>} />
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
