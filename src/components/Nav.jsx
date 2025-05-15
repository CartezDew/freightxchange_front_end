import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import './Nav.css';
import logo from '../assets/logotightcrop.png';


function NavBar({ user, handleSignOut }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff8f0', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', paddingY: '4px !important' }}>
      <Box display="flex" alignItems="center" gap={1}>
          <img
            src={logo}
            alt="FreightXchange logo"
            style={{ height: '32px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <>
              <Button component={Link} to="/profile" sx={navLinkStyle}>
                My Profile
              </Button>
              <Button component={Link} to="/loads" sx={navLinkStyle}>
                Loads
              </Button>
              <Button component={Link} to="/loads/new" sx={navLinkStyle}>
                Add Load
              </Button>
              <Button onClick={handleSignOut} sx={navButtonStyle}>
                Sign Out
              </Button>
            </>
          )}

          {!user && (
            <Button component={Link} to="/login" sx={navLinkStyle}>
              Login
            </Button>
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

export default NavBar;