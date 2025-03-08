import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutGrid, PlusCircle, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className={`h-screen bg-gray-900 text-white 
    ${isOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col`}>
      {/* Toggle Button */}
      <div className="flex justify-between items-center p-4">
        <button onClick={() => setIsOpen(!isOpen)} 
        className="text-white hover:bg-gray-700">
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`flex flex-col justify-between p-4 w-full ${
          !isOpen ? "hidden" : ""
        }`}>
        <NavLink to="/" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
          {isOpen && <Home size={24} />} 
          {isOpen && "Home "}
        </NavLink>
        <NavLink to="/action-dashboard" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
          {isOpen && <LayoutGrid size={24} /> }
          {isOpen && "Action Dashboard "}
        </NavLink>
        <NavLink to="/create-action" className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
          {isOpen && <PlusCircle size={24} />}
          {isOpen && "Create Action "}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;