import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { Header } from "@/components/Header";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import IoTMonitor from "@/pages/IoTMonitor";
import CreateListing from "@/pages/CreateListing";
import ListingDetail from "@/pages/ListingDetail";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/marketplace">
        {() => <ProtectedRoute component={Marketplace} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute component={Analytics} />}
      </Route>
      <Route path="/iot">
        {() => <ProtectedRoute component={IoTMonitor} />}
      </Route>
      <Route path="/create-listing">
        {() => <ProtectedRoute component={CreateListing} />}
      </Route>
      <Route path="/listing/:id">
        {() => <ProtectedRoute component={ListingDetail} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { currentUser } = useAppContext();
  const showHeader = location !== '/' && location !== '/login';
  const showTour = currentUser && location !== '/' && location !== '/login';

  // Initialize WebSocket and keyboard shortcuts
  useWebSocket();
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <Router />
      {showTour && <OnboardingTour />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <AppContent />
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
