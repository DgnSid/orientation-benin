import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Index from "./pages/Index";
import Universities from "./pages/Universities";
import UniversityDetails from "./pages/UniversityDetails";
import Filieres from "./pages/Filieres";
import FiliereDetails from "./pages/FiliereDetails";
import Concours from "./pages/Concours";
import Stages from "./pages/Stages";
import Formations from "./pages/Formations";
import Conseils from "./pages/Conseils";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/universities/:id" element={<UniversityDetails />} />
              <Route path="/filieres" element={<Filieres />} />
              <Route path="/filieres/:slug" element={<FiliereDetails />} />
              <Route path="/concours" element={<Concours />} />
              <Route path="/stages" element={<Stages />} />
              <Route path="/formations" element={<Formations />} />
              <Route path="/conseils" element={<Conseils />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
