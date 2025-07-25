import { useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { Home } from "./pages/Home";
import { YachtDetail } from "./pages/YachtDetail";
import { YachtsList } from "./pages/YachtsList";
import { LocationsList } from "./pages/LocationsList";
import { LocationDetail } from "./pages/LocationDetail";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminPanel } from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 دقائق للبيانات القديمة
    },
  },
});

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function RouteWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  useEffect(() => {
    // إعادة تحميل البيانات عند تغيير المسار
    queryClient.invalidateQueries();
  }, [location.pathname]);

  return <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTopOnRouteChange />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route 
                      path="/yachts" 
                      element={
                        <RouteWrapper>
                          <YachtsList />
                        </RouteWrapper>
                      } 
                    />
                    <Route 
                      path="/yacht/:id" 
                      element={
                        <RouteWrapper>
                          <YachtDetail />
                        </RouteWrapper>
                      } 
                    />
                    <Route 
                      path="/locations" 
                      element={
                        <RouteWrapper>
                          <LocationsList />
                        </RouteWrapper>
                      } 
                    />
                    <Route 
                      path="/location/:id" 
                      element={
                        <RouteWrapper>
                          <LocationDetail />
                        </RouteWrapper>
                      } 
                    />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
