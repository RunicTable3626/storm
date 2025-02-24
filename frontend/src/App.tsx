import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActionCreationPage from "./pages/ActionCreationPage";
import ActionDashboardPage from "./pages/ActionDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Router>
      <div>
        {/* Sidebar or Navbar with navigation links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Action Dashboard</Link></li>
            <li><Link to="/settings">Create Actions</Link></li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ActionDashboardPage />} />
          <Route path="/settings" element={<ActionCreationPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
