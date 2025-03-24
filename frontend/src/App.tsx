import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { lazy, Suspense } from "react";
import GlobalLoader from "./components/ui/globalLoader";

const PrivateRoute = lazy(() => import("@/pages/ProtectedRoute"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Layout = lazy(() => import("@/components/Layout"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignUpPage = lazy(() => import("@/pages/SignupPage"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
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
  );
};

export default App;
