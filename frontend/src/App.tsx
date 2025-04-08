import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/contexts/AuthContext";
import { lazy, Suspense } from "react";
import GlobalLoader from "@/components/ui/globalLoader";
import Layout from "@/components/layout/Layout";
import { Provider } from "react-redux";
import store from "./store/store";

const ProtectedRoute = lazy(() => import("@/components/layout/ProtectedRoute"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const SignUpPage = lazy(() => import("@/modules/auth/pages/SignupPage"));
const ForgotPassword = lazy(
  () => import("@/modules/auth/pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("@/modules/auth/pages/ResetPasswordPage")
);
const TasksPage = lazy(() => import("@/modules/tasks/pages/TasksPage"));

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<TasksPage />} />
                </Route>
              </Route>
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
