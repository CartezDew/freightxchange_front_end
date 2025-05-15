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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {offers.map((offer, index) => {
        const brokerCompany = offer.load?.company_name || "Unknown Broker";
        const carrierCompany = offer.carrier_company || offer.carrier_name || offer.carrier || "Unknown Carrier";

        return (
          <Box key={offer.id} sx={{
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            backgroundColor: '#fff8f0',
            boxShadow: 1
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {index + 1}. ${offer.offer_amount || offer.amount}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(offer.submitted_at).toLocaleDateString()}
            </Typography>
            {showCarrier && (
              <Typography variant="body2">
                Carrier: {carrierCompany}
              </Typography>
            )}
            {showBroker && (
              <Typography variant="body2">
                Broker: {brokerCompany}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <Typography sx={{ m: 3 }}>Loading profile...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            color: '#5D3A00',
            borderColor: '#5D3A00',
            '&:hover': {
              backgroundColor: '#f8f2ec',
              borderColor: '#5D3A00',
            },
          }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Box>

      <Box sx={{ backgroundColor: "#fdf8f3", p: 3, borderRadius: 2, boxShadow: 2 }}>
        {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              sx={textFieldStyle}
            />
            <TextField
              label="Authority ID"
              value={authorityId}
              onChange={(e) => setAuthorityId(e.target.value)}
              required
              sx={textFieldStyle}
            />
            {role === "carrier" && (
              <>
                <TextField
                  label="License ID"
                  value={licenseId}
                  onChange={(e) => setLicenseId(e.target.value)}
                  required
                  sx={textFieldStyle}
                />
                <TextField
                  select
                  label="Equipment Type"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  required
                  sx={textFieldStyle}
                >
                  {EQUIPMENT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: '#5D3A00',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4a2f00',
                },
              }}
            >
              Save Profile
            </Button>
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
      </Box>

      {role === "carrier" && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: "#5D3A00", mb: 2 }}>My Submitted Offers</Typography>
          {renderOfferItems(submittedOffers, true, false)}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" sx={{ color: "#5D3A00", mb: 2 }}>My Won Bids</Typography>
          {renderOfferItems(wonBids, true, false)}
        </Box>
      )}

      {role === "broker" && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: "#5D3A00", mb: 2 }}>Offers Received</Typography>
          {renderOfferItems(receivedOffers, false, true)}
        </Box>
      )}
    </Container>
  );
}

const textFieldStyle = {
  '& label': { color: '#5D3A00' },
  '& label.Mui-focused': { color: '#5D3A00' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#5D3A00' },
    '&:hover fieldset': { borderColor: '#5D3A00' },
    '&.Mui-focused fieldset': { borderColor: '#5D3A00' },
  },
};

export default Profile;
