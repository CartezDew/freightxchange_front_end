import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../services/users";
import './Nav.css';

function Nav({ user }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();                 // Clear localStorage
    navigate("/");             // Redirect to home
    window.location.reload();  // Optional: force App state reset
  };

  const authenticatedOptions = (
    <>
      <NavLink className="nav-link" to="/profile">
        My Profile
      </NavLink>
      <NavLink className="nav-link" to="/loads">
        Loads
      </NavLink>
      <NavLink className="nav-link" to="/loads/new">
        Add Load
      </NavLink>
      <button className="nav-link signout-btn" onClick={handleSignOut}>
        Sign Out
      </button>
    </>
  );

  const unauthenticatedOptions = (
    <>
      <NavLink className="nav-link" to="/register">
        Register
      </NavLink>
    </>
  );

  return (
    <nav className={`nav ${user?.role === 'broker' ? 'broker' : 'carrier'}`}>
      <div className="nav-header">
        {user && (
          <div className="link welcome">
            Welcome, {user.username || user.user?.username || "User"}
          </div>
        )}
      </div>
      <div className="nav-links">
        {user ? authenticatedOptions : unauthenticatedOptions}
      </div>
    </nav>
  );
}

export default Nav;
