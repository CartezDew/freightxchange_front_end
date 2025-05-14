import { useEffect, useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";

function Profile({user}) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [wonBids, setWonBids] = useState([]);
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

        // For carriers: fetch won bids
        if (storedRole === "carrier") {
          const bidRes = await api.get(`/offers/?status=awarded&carrier=${profileId}`);
          setWonBids(bidRes.data);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  const isCarrierMissingInfo = role === "carrier" &&
    (!profile.company_name || !profile.policy_id || !profile.license_id || !profile.equipment_type);

  const isBrokerMissingInfo = role === "broker" &&
    (!profile.company_name || !profile.policy_id || !profile.authority_id);

  if (isCarrierMissingInfo || isBrokerMissingInfo) {
    return (
      <div className="profile-page">
        <h2>Welcome, {profile.user.username}</h2>
        <p>You must complete your profile before you can {role === "carrier" ? "bid on loads" : "post a load"}.</p>
        <p>Please ensure the following fields are filled out:</p>
        <ul>
          {role === "carrier" && (
            <>
              {!profile.company_name && <li>Company Name</li>}
              {!profile.policy_id && <li>Policy ID</li>}
              {!profile.license_id && <li>License ID</li>}
              {!profile.equipment_type && <li>Equipment Type</li>}
            </>
          )}
          {role === "broker" && (
            <>
              {!profile.company_name && <li>Company Name</li>}
              {!profile.policy_id && <li>Insurance Policy Number</li>}
              {!profile.authority_id && <li>Authority ID</li>}
            </>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Welcome, {user?.username || "User"}</h1>

      <p>Company Name: {profile.company_name}</p>

      {role === "carrier" && (
        <>
          <p>Policy ID: {profile.policy_id}</p>
          <p>License ID: {profile.license_id}</p>
          <p>Equipment Type: {profile.equipment_type}</p>
          <h2>My Current Loads (Won Bids)</h2>
          {wonBids.length > 0 ? (
            <ul>
              {wonBids.map((bid) => (
                <li key={bid.id}>
                  Load #{bid.load.id}: {bid.load.pickup_city} → {bid.load.delivery_city} | ${bid.load.rate}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no current loads.</p>
          )}
        </>
      )}

      {role === "broker" && (
        <>
          <p>Insurance Policy Number: {profile.policy_id}</p>
          <p>Authority ID: {profile.authority_id}</p>
        </>
      )}
    </div>
  );
}

export default Profile;