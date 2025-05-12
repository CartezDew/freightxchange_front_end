import { useState, useEffect } from 'react'
import { verifyUser } from './services/users.js'
import Nav from './components/Nav'
import Home from './pages/Home'
import Register from './pages/Register'
import Profile from './pages/Profile'
import LogOut from './pages/LogOut.jsx'
import Loads from './pages/Loads'
import LoadDetail from './pages/LoadDetail'
import NewLoad from './pages/NewLoad'
import EditLoad from './pages/EditLoad'
import Offers from './pages/Offers'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
    const [user, setUser] = useState(null):

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