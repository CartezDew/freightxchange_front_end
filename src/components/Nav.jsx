import { NavLink } from "react-router-dom";
import './Nav.css'

function Nav({ user }) {
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
    </>
  );

  const unauthenticatedOptions = (
    <>
      <NavLink className="nav-link" to="/profile">
        My Profile
      </NavLink>
      <NavLink className="nav-link" to="/loads">
        Loads
      </NavLink>
    </>
  );

  return (
    <nav className={`nav ${user?.role === 'broker' ? 'broker' : 'carrier'}`}>
      {user && <div className="link welcome">Welcome, {user.username}</div>}
      <div className="nav-links">
        {user ? authenticatedOptions : unauthenticatedOptions}
      </div>
    </nav>
  );
}

export default Nav;
