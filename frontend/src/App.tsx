import { BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActionCreationPage from "./pages/ActionCreationPage";
import ActionDashboardPage from "./pages/ActionDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ShareIdRedirect from "./pages/ShareIdRedirect";
import NotFoundPage from "./pages/NotFoundPage";
import Sidebar from "./components/Sidebar";
import Modal from "react-modal";
import { useUser } from '@clerk/clerk-react';
import React from "react";



Modal.setAppElement("#root");

const App = () => {
  interface ProtectedRouteProps {
    element: any;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isSignedIn } = useUser();
  
    if (!isSignedIn) {
      return <Navigate to="/" replace />;
    }
  
    return element;
  };

  const AppContent = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/create-action';

    return (
      <>
        {showSidebar && <Sidebar />}
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/action-dashboard" element={<ActionDashboardPage/>} />
            <Route 
              path="/admin-dashboard" 
              element={<ProtectedRoute element={<AdminDashboardPage />} />}/> 
            <Route 
              path="/create-action" 
              element={<ProtectedRoute element={<ActionCreationPage />} />}/> 
            <Route path="/action/:shareId" element={<ShareIdRedirect />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
