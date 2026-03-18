import FloatingFeedback from "@/components/FloatingFeedback";
import { Toaster } from "@/components/ui/sonner";
import { ScanProvider } from "@/context/ScanContext";
import AnalysisPage from "@/pages/AnalysisPage";
import HistoryPage from "@/pages/HistoryPage";
import HomePage from "@/pages/HomePage";
import QRCodePage from "@/pages/QRCodePage";
import ResultsPage from "@/pages/ResultsPage";
import ScanPage from "@/pages/ScanPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: ScanPage,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analysis",
  component: AnalysisPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const qrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/qr",
  component: QRCodePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  scanRoute,
  analysisRoute,
  resultsRoute,
  historyRoute,
  qrRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScanProvider>
        <RouterProvider router={router} />
        <FloatingFeedback />
        <Toaster />
      </ScanProvider>
    </QueryClientProvider>
  );
}
