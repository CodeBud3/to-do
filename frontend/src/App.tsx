// import { Button } from "@/components/ui/button";

import Navbar from "./components/modules/navbar/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignupPage";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="page-box-model">
        <SignUpPage></SignUpPage>
      </div>
    </>
  );
}

export default App;
