import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { signOut } from "../services/users";
import logo from "../assets/logotightcrop.png";
import './Nav.css';

function Nav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate("/");
    window.location.reload();
  };

  const isHomePage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";
  const isAddLoadPage = location.pathname === "/loads/new";
  const isLoadsPage = location.pathname === "/loads";

  const formatName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displayName = user
    ? formatName(user.username || user.user?.username || user.id || "User")
    : "";

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff8f0', boxShadow: 1 }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '64px !important',
          paddingY: '4px !important',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src={logo}
            alt="FreightXchange logo"
            style={{ height: '32px', objectFit: 'contain', display: 'block' }}
          />
          {user && (
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#5d4037' }}>
              Welcome, {displayName}
            </Typography>
          )}
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              {!isProfilePage && (
                <Button component={Link} to="/profile" sx={navLinkStyle}>
                  My Profile
                </Button>
              )}
              {!isLoadsPage && (
                <Button component={Link} to="/loads" sx={navLinkStyle}>
                  Loads
                </Button>
              )}
              {user.role === "broker" && !isAddLoadPage && (
                <Button component={Link} to="/loads/new" sx={navLinkStyle}>
                  Add Load
                </Button>
              )}
              <Button onClick={handleSignOut} sx={navButtonStyle}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              {isRegisterPage && (
                <Button component={Link} to="/" sx={navLinkStyle}>
                  Home
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const navLinkStyle = {
  color: '#5d4037',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    color: '#8b4513',
  },
};

const navButtonStyle = {
  ...navLinkStyle,
  backgroundColor: '#eee',
  px: 2,
  borderRadius: 1,
  '&:hover': {
    backgroundColor: '#ddd',
  },
};

export default Nav;
