import CookieNotice from "@/components/CookieNotice";
import FloatingFeedback from "@/components/FloatingFeedback";
import { Toaster } from "@/components/ui/sonner";
import { ScanProvider } from "@/context/ScanContext";
import AnalysisPage from "@/pages/AnalysisPage";
import BookByCodePage from "@/pages/BookByCodePage";
import DemoPage from "@/pages/DemoPage";
import DentistDashboardPage from "@/pages/DentistDashboardPage";
import DentistRegisterPage from "@/pages/DentistRegisterPage";
import FindDentistPage from "@/pages/FindDentistPage";
import HistoryPage from "@/pages/HistoryPage";
import HomePage from "@/pages/HomePage";
import IssuePassportPage from "@/pages/IssuePassportPage";
import MessagesPage from "@/pages/MessagesPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import PassportLookupPage from "@/pages/PassportLookupPage";
import PassportPage from "@/pages/PassportPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProfilePage from "@/pages/ProfilePage";
import QRCodePage from "@/pages/QRCodePage";
import ResultsPage from "@/pages/ResultsPage";
import ScanPage from "@/pages/ScanPage";
import TermsPage from "@/pages/TermsPage";
import UITestPage from "@/pages/UITestPage";
import YStatementPage from "@/pages/YStatementPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Bug } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDebugPage = pathname === "/ui-test";

  return (
    <>
      <Outlet />
      <FloatingFeedback />
      <CookieNotice />
      <Toaster />
      {!isDebugPage && (
        <Link
          to="/ui-test"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border border-border/50 bg-card/90 backdrop-blur text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-lg"
          data-ocid="debug.open_modal_button"
        >
          <Bug className="w-3.5 h-3.5" />
          Debug
        </Link>
      )}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

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

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const findDentistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/find-dentist",
  component: FindDentistPage,
});

const dentistRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dentist-register",
  component: DentistRegisterPage,
});

const dentistDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dentist-dashboard",
  component: DentistDashboardPage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookByCodePage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$bookingId",
  component: MessagesPage,
});

const passportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passport",
  component: PassportPage,
});

const issuePassportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issue-passport",
  component: IssuePassportPage,
});

const passportLookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passport-lookup",
  component: PassportLookupPage,
});

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo",
  component: DemoPage,
});

const uiTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ui-test",
  component: UITestPage,
});

const pitchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pitch",
  component: YStatementPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  scanRoute,
  analysisRoute,
  resultsRoute,
  historyRoute,
  qrRoute,
  profileRoute,
  privacyRoute,
  termsRoute,
  findDentistRoute,
  dentistRegisterRoute,
  dentistDashboardRoute,
  bookRoute,
  myBookingsRoute,
  messagesRoute,
  passportRoute,
  issuePassportRoute,
  passportLookupRoute,
  demoRoute,
  uiTestRoute,
  pitchRoute,
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
      </ScanProvider>
    </QueryClientProvider>
  );
}
