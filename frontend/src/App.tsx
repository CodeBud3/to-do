import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { lazy, Suspense } from "react";
import GlobalLoader from "@/components/ui/globalLoader";
import Layout from "@/components/Layout";
import { AlertDialogProvider } from "./contexts/AlertDialogContext";

const PrivateRoute = lazy(() => import("@/components/modules/ProtectedRoute"));
const Dashboard = lazy(
  () => import("@/components/modules/dashboard/DashboardPage")
);
const LoginPage = lazy(() => import("@/components/modules/auth/LoginPage"));
const SignUpPage = lazy(() => import("@/components/modules/auth/SignupPage"));
const ForgotPassword = lazy(
  () => import("@/components/modules/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("@/components/modules/auth/ResetPasswordPage")
);

const App = () => {
  return (
    <AlertDialogProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Route>
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </AlertDialogProvider>
  );
};

export default App;
