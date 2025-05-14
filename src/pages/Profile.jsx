import { useEffect, useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";

function Profile({ user }) {
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
        navigate("/");
        return;
      }

      setRole(storedRole);

      try {
        const res = await api.get(`/${storedRole}-profiles/${profileId}/`);
        setProfile(res.data);

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

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profile) {
    return <Typography sx={{ m: 3 }}>Loading profile...</Typography>;
  }

  const isCarrierMissingInfo = role === "carrier" &&
    (!profile.company_name || !profile.policy_id || !profile.license_id || !profile.equipment_type);

  const isBrokerMissingInfo = role === "broker" &&
    (!profile.company_name || !profile.policy_id || !profile.authority_id);

  if (isCarrierMissingInfo || isBrokerMissingInfo) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ mt: 4 }}>
          Welcome, {user?.username || "User"}
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          You must complete your profile before you can {role === "carrier" ? "bid on loads" : "post a load"}.
        </Alert>
        <Typography sx={{ mt: 2 }}>Please ensure the following fields are filled out:</Typography>
        <List>
          {role === "carrier" && (
            <>
              {!profile.company_name && <ListItem><ListItemText primary="Company Name" /></ListItem>}
              {!profile.policy_id && <ListItem><ListItemText primary="Policy ID" /></ListItem>}
              {!profile.license_id && <ListItem><ListItemText primary="License ID" /></ListItem>}
              {!profile.equipment_type && <ListItem><ListItemText primary="Equipment Type" /></ListItem>}
            </>
          )}
          {role === "broker" && (
            <>
              {!profile.company_name && <ListItem><ListItemText primary="Company Name" /></ListItem>}
              {!profile.policy_id && <ListItem><ListItemText primary="Insurance Policy Number" /></ListItem>}
              {!profile.authority_id && <ListItem><ListItemText primary="Authority ID" /></ListItem>}
            </>
          )}
        </List>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username || "User"}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Company Name:</Typography>
        <Typography>{profile.company_name}</Typography>

        {role === "carrier" && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Policy ID:</Typography>
            <Typography>{profile.policy_id}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>License ID:</Typography>
            <Typography>{profile.license_id}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Equipment Type:</Typography>
            <Typography>{profile.equipment_type}</Typography>

            <Typography variant="h5" sx={{ mt: 4 }}>My Current Loads (Won Bids)</Typography>
            {wonBids.length > 0 ? (
              <List>
                {wonBids.map((bid) => (
                  <ListItem key={bid.id} divider>
                    <ListItemText
                      primary={`Load #${bid.load.id}`}
                      secondary={`${bid.load.pickup_city} → ${bid.load.delivery_city} | $${bid.load.rate}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>You have no current loads.</Typography>
            )}
          </>
        )}

        {role === "broker" && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Insurance Policy Number:</Typography>
            <Typography>{profile.policy_id}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Authority ID:</Typography>
            <Typography>{profile.authority_id}</Typography>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Profile;
