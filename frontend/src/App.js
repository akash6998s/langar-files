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

function App() {
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
      </Routes>
      </div>
  );
}

export default App;
