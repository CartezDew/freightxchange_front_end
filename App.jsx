import { useState, useEffect } from 'react';
import { verifyUser, signOut, signIn } from './services/users';
import api from './services/apiConfig';
import Nav from './components/Nav';
import Home from './pages/Home';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import CarrierProfile from './pages/CarrierProfile';
import BrokerProfile from './pages/BrokerProfile';
import Loads from './pages/Loads';
import CreateLoad from './pages/CreateLoad';
import EditLoad from './pages/EditLoad';
import LoadDetail from './pages/LoadDetail';
import Offers from './pages/Offers';
import OfferDetail from './pages/OfferDetail';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const isVerified = await verifyUser();
      if (isVerified) {
        try {
          const resp = await api.get('/broker-profiles/'); // You can adjust to `/carrier-profiles/` based on role
          setUser(resp.data); // Ideally replace with a `/me/` endpoint--- will update later once routes work
        } catch (err) {
          console.log('Could not fetch user profile:', err);
          signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    initUser();
  }, []);

  return (
    <>
      <Nav user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/sign-in" element={<SignIn setUser={setUser} />} />
        <Route path="/sign-out" element={<SignOut setUser={setUser} />} />

        {/* Profiles */}
        <Route path="/carrier-profiles/:id" element={<CarrierProfile />} />
        <Route path="/broker-profiles/:id" element={<BrokerProfile />} />

        {/* Loads */}
        <Route path="/loads" element={<Loads />} />
        <Route path="/loads/new" element={<CreateLoad />} />
        <Route path="/loads/:id/edit" element={<EditLoad />} />
        <Route path="/loads/:id" element={<LoadDetail />} />

        {/* Offers */}
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/:id" element={<OfferDetail />} />
      </Routes>
        </>
    )
}

export default App

