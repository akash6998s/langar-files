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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <>
      <Routes>
        {/* Define Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
