// import { Button } from "@/components/ui/button";

import Navbar from "./components/modules/navbar/Navbar";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="page-box-model">
        <LoginPage></LoginPage>
      </div>
    </>
  );
}

export default App;
