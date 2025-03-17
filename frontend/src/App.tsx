import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
