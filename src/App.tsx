import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import { ProfessionalsProvider } from "./contexts/ProfessionalsContext";
import { EventsProvider } from "./contexts/EventsContext";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";

const Index = lazy(() => import("./pages/Index"));
const EventPage = lazy(() => import("./pages/EventPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AdminRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <AdminPage /> : <Navigate to="/admin/login" replace />;
};

const AdminLoginRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/admin?tab=events" replace /> : <AdminLoginPage />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <ProfessionalsProvider>
          <EventsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/eventos" element={<EventsPage />} />
                  <Route path="/evento/:slug" element={<EventPage />} />
                  <Route path="/admin/login" element={<AdminLoginRoute />} />
                  <Route path="/admin" element={<AdminRoute />} />
                  <Route path="/admin/eventos" element={<Navigate to="/admin?tab=events" replace />} />
                  <Route path="/admin/evento/:slug/editar" element={<Navigate to="/admin?tab=events" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </EventsProvider>
        </ProfessionalsProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
