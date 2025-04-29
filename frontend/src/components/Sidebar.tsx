import { NavLink} from "react-router-dom";
import GlobalAudio from "./GlobalAudio";
import NotificationButton from "./NotificationButton";
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react'


const Sidebar = () => {
  return (
    <nav>
      <NavLink to="/" end className="nav-link">
      Home
      </NavLink>
      <NavLink to="/action-dashboard" end className="nav-link">
      Action Dashboard
      </NavLink>

      <SignedIn>
        <NavLink to="/create-action" className="nav-link">
        Create Action
        </NavLink>

        <UserButton />
      </SignedIn>

      <SignedOut>
      <SignInButton>
        <button>Admin Login</button>
      </SignInButton>
      </SignedOut>


      <GlobalAudio/>

      <NotificationButton/>


    </nav>
  );
};

export default Sidebar;
