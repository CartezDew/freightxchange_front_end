import { useState, useEffect } from 'react'
import { verifyUser } from './src/services/users.js'
import Nav from './components/Nav'
import Home from './src/pages/Home.jsx'
import Register from './pages/Register'
import Profile from './src/pages/Profile.jsx'
import LogOut from './src/pages/LogOut.jsx'
import Loads from './src/pages/Loads.jsx'
import LoadDetail from './src/pages/LoadDetail.jsx'
import NewLoad from './src/pages/NewLoad.jsx'
import EditLoad from './src/pages/EditLoad.jsx'
import Offers from './src/pages/Offers.jsx'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await verifyUser();
            user ? setUser(user) : setUser(null);
        };

        fetchUser();
    }, []);

    return (
        <>
         <Nav user={user} />
      <Routes>
        <Route path="/" element={<Home setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/profile/:Id" element={<Profile setUser={setUser} />} />
        <Route path="/logout" element={<LogOut setUser={setUser} />} />
        <Route path="/loads" element={<Loads />} />
        <Route path="/loads/new" element={<NewLoad />} />
        <Route path="/loads/:loadId/edit" element={<EditLoad />} />
        <Route path="/loads/:loadId" element={<LoadDetail />} />
        <Route path="/loads/:loadId/delete" element={<DeleteLoad />} />
        <Route path="/offers/:offerId" element={<Offers />} />
      </Routes>
        </>
    )
}