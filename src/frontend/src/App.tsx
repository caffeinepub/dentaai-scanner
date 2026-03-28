import CookieNotice from "@/components/CookieNotice";
import FloatingFeedback from "@/components/FloatingFeedback";
import { Toaster } from "@/components/ui/sonner";
import { ScanProvider } from "@/context/ScanContext";
import AnalysisPage from "@/pages/AnalysisPage";
import BookByCodePage from "@/pages/BookByCodePage";
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
        <CookieNotice />
        <Toaster />
      </ScanProvider>
    </QueryClientProvider>
  );
}
