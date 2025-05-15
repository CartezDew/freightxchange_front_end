import { useEffect, useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Alert,
  TextField,
  MenuItem,
  Button,
  Divider,
  Paper,
} from "@mui/material";

const EQUIPMENT_OPTIONS = [
  "Box Truck", "Car Hauler", "Conestoga", "Container Chassis",
  "Dry Van", "Dumptruck", "Flatbed", "Gooseneck", "Hotshot",
  "Livestock Trailer", "Logging", "Lowboy", "Power Only",
  "Reefer", "Step Deck", "Tanker", "Walking Floor"
];

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [wonBids, setWonBids] = useState([]);
  const [submittedOffers, setSubmittedOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [authorityId, setAuthorityId] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [equipmentType, setEquipmentType] = useState("");

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

        setCompanyName(res.data.company_name || "");
        setAuthorityId(res.data.authority_id || "");
        setLicenseId(res.data.license_id || "");
        setEquipmentType(res.data.equipment_type || "");

        const offersRes = await api.get(`/offers/?${storedRole}=${profileId}`);
        const offers = offersRes.data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

        if (storedRole === "carrier") {
          setSubmittedOffers(offers);
          setWonBids(offers.filter(o => o.status === "awarded"));
        } else if (storedRole === "broker") {
          setReceivedOffers(offers);
        }

      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const updatedFields = {
        company_name: companyName,
        authority_id: authorityId,
        ...(role === "carrier" && { license_id: licenseId, equipment_type: equipmentType }),
      };

      const profileId = localStorage.getItem("profileId");
      await api.patch(`/${role}-profiles/${profileId}/`, updatedFields);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to save profile updates.");
    }
  };

  const renderOfferItems = (offers, showBroker, showCarrier) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {offers.map((offer, index) => {
        const brokerCompany = offer.broker_company || offer.load?.company_name || "Unknown Broker";
        const carrierCompany = offer.carrier_company || offer.carrier_name || offer.carrier || "Unknown Carrier";

        return (
          <Paper key={offer.id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>Bid {index + 1}</Typography>
            <Typography><strong>Amount:</strong> ${offer.offer_amount || offer.amount}</Typography>
            {showCarrier && <Typography><strong>Carrier:</strong> {carrierCompany}</Typography>}
            {showBroker && <Typography><strong>Broker:</strong> {brokerCompany}</Typography>}
            <Typography><strong>Date:</strong> {new Date(offer.submitted_at).toLocaleDateString()}</Typography>
          </Paper>
        );
      })}
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <Typography sx={{ m: 3 }}>Loading profile...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Box>

      {isEditing ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          <TextField label="Authority ID" value={authorityId} onChange={(e) => setAuthorityId(e.target.value)} required />
          {role === "carrier" && (
            <>
              <TextField label="License ID" value={licenseId} onChange={(e) => setLicenseId(e.target.value)} required />
              <TextField
                select
                label="Equipment Type"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                required
              >
                {EQUIPMENT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </>
          )}
          <Button variant="contained" color="primary" onClick={handleSave}>Save Profile</Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">Company Name:</Typography>
          <Typography>{profile.company_name}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Authority ID:</Typography>
          <Typography>{profile.authority_id}</Typography>
          {role === "carrier" && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>License ID:</Typography>
              <Typography>{profile.license_id}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Equipment Type:</Typography>
              <Typography>{profile.equipment_type}</Typography>
            </>
          )}
        </Box>
      )}

      {role === "carrier" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">My Submitted Offers</Typography>
          {renderOfferItems(submittedOffers, true, false)}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5">My Won Bids</Typography>
          {wonBids.length > 0 ? (
            renderOfferItems(wonBids, true, false)
          ) : (
            <Typography sx={{ mt: 2 }}>You haven't been awarded any loads.</Typography>
          )}
        </Box>
      )}

      {role === "broker" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Offers Received</Typography>
          {renderOfferItems(receivedOffers, false, true)}
        </Box>
      )}
    </Container>
  );
}

export default Profile;