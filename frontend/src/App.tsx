import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActionCreationPage from "./pages/ActionCreationPage";
import ActionDashboardPage from "./pages/ActionDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import Sidebar from "./components/Sidebar";
import Modal from "react-modal";
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from "react";
import { registerServiceWorker } from "./utils/fcm"; // adjust path as needed


Modal.setAppElement("#root");

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);


  interface ProtectedRouteProps {
    element: any; // Using 'any' type for the 'element' prop
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isSignedIn } = useUser(); // Clerk hook to check if the user is signed in
  
    if (!isSignedIn) {
      
      return <Navigate to="/" replace />; // Redirect to sign-in page if not authenticated
    }
  
    return element;
  };

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
            <Route 
              path="/create-action" 
              element={<ProtectedRoute element={<ActionCreationPage />} />} 
            />
            <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
