import { NavLink } from "react-router-dom";

function Nav({ user }) {
  const authenticatedOptions = (
    <>
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
      <NavLink className="nav-link" to="/">
        Log-In
      </NavLink>
      <NavLink className="nav-link" to="/register">
        Register
      </NavLink>
    </>
  );

  return (
    <nav>
      {user && <div className="link welcome">Welcome, {user.username}</div>}
      <div className="nav-links">
        {user ? authenticatedOptions : unauthenticatedOptions}
      </div>
    </nav>
  );
}

export default Nav;
