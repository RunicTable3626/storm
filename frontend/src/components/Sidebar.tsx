import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutGrid, PlusCircle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import GlobalAudio from "./GlobalAudio";

const Sidebar = () => {
  return (
    <nav>
      <NavLink to="/" end className="nav-link">
      Home
      </NavLink>
      <NavLink to="/action-dashboard" end className="nav-link">
      Action Dashboard
      </NavLink>
      <NavLink to="/create-action" className="nav-link">
      Create Action
      </NavLink>

      <GlobalAudio/>
    </nav>
  );
};

export default Sidebar;

