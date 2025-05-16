import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin";
import SuperAdminLogin from "./pages/login/SuperAdminLogin";
import Sewadaar from "./components/Sewadaar";
import DonationsTable from "./components/DonationsTable";
import AllExpensesTable from "./components/AllExpensesTable";
import { useEffect, useRef } from "react";

function App() {

  const timeoutRef = useRef(null);
  const hiddenTimeRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden
        hiddenTimeRef.current = Date.now();
        timeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 300000); // 5 minutes
      } else {
        // Page is visible again
        const hiddenDuration = Date.now() - hiddenTimeRef.current;
        if (hiddenDuration >= 300000) {
          window.location.reload();
        } else {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timeoutRef.current);
    };
  }, []);



  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <div className="background-wrapper">
      <Routes>
        {/* Define Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/sewadaar" element={<Sewadaar />} />
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
        <Route path="/donations" element={<DonationsTable />} />
        <Route path="/expenses" element={<AllExpensesTable />} />
      </Routes>
      </div>
  );
}

export default App;
