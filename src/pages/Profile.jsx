import { useEffect, useState } from "react";
import api from "../services/apiConfig";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Divider,
  Paper,
  Modal,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const EQUIPMENT_OPTIONS = [
  "Box Truck", "Car Hauler", "Conestoga", "Container Chassis",
  "Dry Van", "Dumptruck", "Flatbed", "Gooseneck", "Hotshot",
  "Livestock Trailer", "Logging", "Lowboy", "Power Only",
  "Reefer", "Step Deck", "Tanker", "Walking Floor"
];

const DECLINE_REASONS = [
  "Too High", "Already Booked", "No Longer Available"
];

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [wonBids, setWonBids] = useState([]);
  const [submittedOffers, setSubmittedOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [declineReasons, setDeclineReasons] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStage, setModalStage] = useState("input");
  const [offerToDelete, setOfferToDelete] = useState(null);

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
      if (!token || !storedRole || !profileId) return navigate("/");
      setRole(storedRole);

      try {
        const res = await api.get(`/${storedRole}-profiles/${profileId}/`);
        setProfile(res.data);
        setCompanyName(res.data.company_name || "");
        setAuthorityId(res.data.authority_id || "");
        setLicenseId(res.data.license_id || "");
        setEquipmentType(res.data.equipment_type || "");

        const offersRes = await api.get(`/offers/?${storedRole}=${profileId}`);
        const sorted = offersRes.data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)).reverse();

        let latestMap = new Map();
        sorted.forEach(o => {
          const key = `${o.load}-${o.carrier}`;
          if (!latestMap.has(key)) latestMap.set(key, o);
        });

        const latest = Array.from(latestMap.values());
        if (storedRole === "carrier") {
          const myLatest = latest.filter(o => o.carrier === parseInt(profileId));
          setSubmittedOffers(myLatest);
          setWonBids(myLatest.filter(o => o.status === "accepted"));
        } else if (storedRole === "broker") {
          setReceivedOffers(latest);
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
      const updated = {
        company_name: companyName,
        authority_id: authorityId,
        ...(role === "carrier" && { license_id: licenseId, equipment_type: equipmentType })
      };
      const profileId = localStorage.getItem("profileId");
      await api.patch(`/${role}-profiles/${profileId}/`, updated);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Failed to save profile updates.");
    }
  };

  const handleBrokerDecision = async (offerId, accepted) => {
    try {
      await api.patch(`/offers/${offerId}/`, {
        status: accepted ? "accepted" : "declined",
        declined_reason: !accepted ? declineReasons[offerId] || "" : ""
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to update offer", err);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      await api.delete(`/offers/${offerToDelete}/`);
      setModalStage("success");
      setModalMessage("Offer deleted successfully.");
    } catch (err) {
      setModalStage("error");
      setModalMessage("Failed to delete offer.");
    }
  };

  const renderOfferItems = (offers, showBroker, showCarrier) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {offers.map((offer, index) => {
        const brokerCompany = offer.broker_company || offer.load?.company_name || "Unknown Broker";
        const carrierCompany = offer.carrier_name || "Unknown Carrier";
        const offerAmount = Number(offer.amount);
        const rateAmount = Number(offer.rate);
        const diff = offerAmount - rateAmount;
        const diffColor = diff > 0 ? 'green' : diff < 0 ? 'red' : 'inherit';

        return (
          <Paper key={offer.id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" align="center">Bid {index + 1}</Typography>
            <Typography><strong>Your Offer:</strong> ${offerAmount.toFixed(2)}</Typography>
            {offer.rate && (
              <>
                <Typography><strong>Broker Rate:</strong> ${rateAmount.toFixed(2)}</Typography>
                <Typography sx={{ color: diffColor, fontWeight: 600 }}>
                  Difference: ${diff.toFixed(2)}
                </Typography>
              </>
            )}
            {showCarrier && <Typography><strong>Carrier:</strong> {carrierCompany}</Typography>}
            {showBroker && <Typography><strong>Broker:</strong> {brokerCompany}</Typography>}
            <Typography><strong>Date:</strong> {new Date(offer.submitted_at).toLocaleDateString()}</Typography>
            <Typography><strong>Status:</strong> {offer.status}</Typography>

            {role === "carrier" && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => {
                  setModalStage("confirm");
                  setModalMessage("Are you sure you want to delete this offer?");
                  setOfferToDelete(offer.id);
                  setModalOpen(true);
                }}
              >Delete Offer</Button>
            )}

            {role === "broker" && offer.status === "pending" && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Decline Reason</InputLabel>
                  <Select
                    value={declineReasons[offer.id] || ""}
                    onChange={(e) => setDeclineReasons(prev => ({ ...prev, [offer.id]: e.target.value }))}
                    label="Decline Reason"
                  >
                    {DECLINE_REASONS.map(reason => (
                      <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button fullWidth variant="contained" color="success" onClick={() => handleBrokerDecision(offer.id, true)}>Accept</Button>
                  <Button fullWidth variant="outlined" color="error" onClick={() => handleBrokerDecision(offer.id, false)} disabled={!declineReasons[offer.id]}>Decline</Button>
                </Box>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsEditing(!isEditing)}
          sx={{ color: '#5D3A00', borderColor: '#5D3A00' }}
        >{isEditing ? "Cancel" : "Edit Profile"}</Button>
      </Box>

      <Box sx={{ backgroundColor: "#fdf8f3", p: 3, borderRadius: 2, boxShadow: 2 }}>
        {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required sx={textFieldStyle} />
            <TextField label="Authority ID" value={authorityId} onChange={(e) => setAuthorityId(e.target.value)} required sx={textFieldStyle} />
            {role === "carrier" && (
              <>
                <TextField label="License ID" value={licenseId} onChange={(e) => setLicenseId(e.target.value)} required sx={textFieldStyle} />
                <TextField select label="Equipment Type" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)} required sx={textFieldStyle}>
                  {EQUIPMENT_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </>
            )}
            <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#5D3A00', color: '#fff' }}>Save Profile</Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6">Company Name:</Typography>
            <Typography>{profile?.company_name}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Authority ID:</Typography>
            <Typography>{profile?.authority_id}</Typography>
            {role === "carrier" && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>License ID:</Typography>
                <Typography>{profile?.license_id}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Equipment Type:</Typography>
                <Typography>{profile?.equipment_type}</Typography>
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
          <Typography variant="h5">My Won Bids</Typography>
          {renderOfferItems(wonBids, true, false)}
        </Box>
      )}

      {role === "broker" && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: "#5D3A00", mb: 2 }}>Offers Received</Typography>
          {renderOfferItems(receivedOffers, false, true)}
        </Box>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, width: 300 }}>
          {modalStage === "confirm" && (
            <>
              <Typography variant="h6" gutterBottom>{modalMessage}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button fullWidth variant="contained" color="error" onClick={handleDeleteOffer}>Yes</Button>
                <Button fullWidth variant="outlined" onClick={() => setModalOpen(false)}>No</Button>
              </Box>
            </>
          )}
          {modalStage === "success" && (
            <>
              <Typography variant="h6" gutterBottom>{modalMessage}</Typography>
              <Button fullWidth variant="contained" onClick={() => window.location.reload()}>Close</Button>
            </>
          )}
          {modalStage === "error" && (
            <>
              <Typography variant="h6" color="error" gutterBottom>Error</Typography>
              <Typography variant="body2" gutterBottom>{modalMessage}</Typography>
              <Button fullWidth variant="contained" onClick={() => setModalOpen(false)}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
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
