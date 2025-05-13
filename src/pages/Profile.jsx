import { useEffect, useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      const storedRole = localStorage.getItem("role");
      const profileId = localStorage.getItem("profileId");

      if (!token || !storedRole || !profileId) {
        navigate("/"); // Not logged in
        return;
      }

      setRole(storedRole); 

      try {
        const res = await api.get(`/${storedRole}-profiles/${profileId}/`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h1>Welcome, {profile.user}</h1>
      <p>Company Name: {profile.company_name}</p>
      <p>Authority ID: {profile.authority_id}</p>



      {/* Conditionally render based on role */}
      {role === "broker" && profile.policy_id && (
        <p>Policy ID: {profile.policy_id}</p>
      )}
      {role === "carrier" && profile.license_id && (
        <p>License ID: {profile.license_id}</p>
      )}
      {role === "carrier" && profile.equipment_type && (
        <p>Equipment Type: {profile.equipment_type}</p>
      )}
    </div>
  );
}

export default Profile;
