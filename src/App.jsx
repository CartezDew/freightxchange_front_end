import { useState, useEffect } from 'react'
import { verifyUser } from './services/users.js'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'


//import LogOut from './pages/LogOut.jsx'
import Loads from './pages/Loads.jsx'
import LoadDetail from './pages/LoadDetail.jsx'
import NewLoad from './pages/NewLoad.jsx'
import Offers from './pages/Offers.jsx'



import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await verifyUser();

      if (userData) {
        // Normalize username regardless of shape
        let normalizedUser;

        if (typeof userData.user === 'string') {
          normalizedUser = {
            ...userData,
            username: userData.user
          };
        } else if (userData.user?.username) {
          normalizedUser = {
            ...userData,
            username: userData.user.username
          };
        } else {
          normalizedUser = userData; // fallback
        }

        setUser(normalizedUser);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);


    return (
         <ThemeProvider theme={theme}>
             <CssBaseline />
             {user !== null && <Nav user={user} />}
              <Routes>
                <Route path="/" element={<Home setUser={setUser} />} />
                <Route path="/register" element={<Register setUser={setUser} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                {/*<Route path="/logout" element={<LogOut setUser={setUser} />} />*/}
                <Route path="/loads" element={<Loads />} />
                {/*<Route path="/logout" element={<LogOut setUser={setUser} />} />*/}
                {/*<Route path="/loads" element={<Loads />} />*/}
                <Route path="/loads/new" element={<NewLoad />} />
                {/*<Route path="/loads/:loadId/edit" element={<EditLoad />} />*/}
                <Route path="/loads/:loadId" element={<LoadDetail />} />
                {/*<Route path="/loads/:loadId/delete" element={<DeleteLoad />} />*/}
                {/*<Route path="/offers/:offerId" element={<Offers />} />*/}
              </Routes>
        </ThemeProvider>

    )
}

export default App;