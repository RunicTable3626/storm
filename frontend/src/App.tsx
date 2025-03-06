import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActionCreationPage from "./pages/ActionCreationPage";
import ActionDashboardPage from "./pages/ActionDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import Sidebar from "./components/Sidebar";


const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar or Navbar with navigation links */}
        <Sidebar />
        {/* Define Routes */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/action-dashboard" element={<ActionDashboardPage />} />
            <Route path="/create-action" element={<ActionCreationPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
