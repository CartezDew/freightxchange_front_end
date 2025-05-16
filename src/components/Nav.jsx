import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, Badge } from "@mui/material";
import { signOut } from "../services/users";
import logo from "../assets/logotightcrop.png";
import { useEffect, useState } from "react";
import './Nav.css';

function Nav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";
  const isAddLoadPage = location.pathname === "/loads/new";
  const isLoadsPage = location.pathname === "/loads";

  const handleSignOut = () => {
    signOut();
    navigate("/");
    window.location.reload();
  };

  const formatName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displayName = user
    ? formatName(user.username || user.user?.username || user.id || "User")
    : "";

  const [openBidCount, setOpenBidCount] = useState(0);
  const [awardedBidCount, setAwardedBidCount] = useState(0);
  const [totalBidCount, setTotalBidCount] = useState(0);

  useEffect(() => {
    const updateCountsFromStorage = () => {
      const open = parseInt(localStorage.getItem("openBidCount") || "0", 10);
      const awarded = parseInt(localStorage.getItem("awardedBidCount") || "0", 10);
      const total = parseInt(localStorage.getItem("totalBidCount") || "0", 10);

      setOpenBidCount(open);
      setAwardedBidCount(awarded);
      setTotalBidCount(total);
    };

    updateCountsFromStorage();

    window.addEventListener("storage", updateCountsFromStorage);
    return () => window.removeEventListener("storage", updateCountsFromStorage);
  }, []);

  const getBadgeCount = (target) => {
    if (!user) return 0;
    if (target === "profile" || target === "loads") {
      if (user.role === "carrier") return awardedBidCount;
      if (user.role === "broker" && !isAddLoadPage) return totalBidCount;
    }
    return 0;
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff8f0', boxShadow: 1 }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '64px !important',
          paddingY: '4px !important',
        }}
      >
        {/* Logo and welcome */}
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

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              {!isProfilePage && (
                <Badge badgeContent={getBadgeCount("profile")} color="primary" overlap="circular">
                  <Button component={Link} to="/profile" sx={navLinkStyle}>
                    My Profile
                  </Button>
                </Badge>
              )}

              {!isLoadsPage && (
                <Badge badgeContent={getBadgeCount("loads")} color="primary" overlap="circular">
                  <Button component={Link} to="/loads" sx={navLinkStyle}>
                    Loads
                  </Button>
                </Badge>
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
