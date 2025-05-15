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
  Select,
  FormControl,
  Modal
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
  const [declineReasons, setDeclineReasons] = useState({});
  const [rebidAmounts, setRebidAmounts] = useState({});
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
        const offers = offersRes.data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)).reverse();

        let latestMap = new Map();
        offers.forEach(offer => {
          const key = `${offer.load}-${offer.carrier}`;
          if (!latestMap.has(key)) {
            latestMap.set(key, offer);
          }
        });

        const latestOffers = Array.from(latestMap.values());

        if (storedRole === "carrier") {
          const myLatest = latestOffers.filter(o => o.carrier === parseInt(profileId));
          setSubmittedOffers(myLatest);
          setWonBids(myLatest.filter(o => o.status === "accepted"));
        } else if (storedRole === "broker") {
          setReceivedOffers(latestOffers);
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

  const handleBrokerDecision = async (offerId, accepted) => {
    try {
      await api.patch(`/offers/${offerId}/`, {
        status: accepted ? "accepted" : "declined",
        declined_reason: !accepted ? declineReasons[offerId] || "" : ""
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to update offer status", err.response?.data || err);
    }
  };

  const handleCarrierRebid = async (loadId, amount) => {
    try {
      const profileId = localStorage.getItem("profileId");
      await api.post(`/offers/`, {
        load: loadId,
        amount: amount,
        carrier: profileId
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit rebid", err);
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
      console.error(err);
    }
  };

  const renderOfferItems = (offers, showBroker, showCarrier) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {offers.map((offer, index) => {
        const brokerCompany = offer.broker_company || offer.load?.company_name || "Unknown Broker";
        const carrierCompany = offer.carrier_company || offer.carrier_name || offer.carrier || "Unknown Carrier";
        const formattedAmount = Number(offer.amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return (
          <Paper key={offer.id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>Bid {index + 1}</Typography>
            <Typography><strong>Amount:</strong> ${formattedAmount}</Typography>
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
              >
                Delete Offer
              </Button>
            )}
          </Paper>
        );
      })}
    </Box>
  );

  return (
    <>
      <Container maxWidth="sm" className="home-container">
        <Paper elevation={3} className="home-paper">
          <Typography variant="h3" align="center" gutterBottom>
            Welcome to FreightXchange
          </Typography>

          <Typography variant="subtitle1" align="center" className="home-subtitle">
            Built for carriers. Backed by brokers.
          </Typography>

          <Box className="home-about" sx={{ my: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              FreightXchange was created to give small carriers a level playing field in the freight
              world. We believe in transparency, accessibility, and empowering owner-operators and
              brokers to build trust through better tools — not middlemen.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box component="form" onSubmit={handleSubmit} className="home-form">
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>

            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="off"
              sx={{
                '& label': { color: '#5D3A00' },
                '& label.Mui-focused': { color: '#5D3A00' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#5D3A00' },
                  '&:hover fieldset': { borderColor: '#5D3A00' },
                  '&.Mui-focused fieldset': { borderColor: '#5D3A00' },
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="off"
              sx={{
                mt: 2,
                '& label': { color: '#5D3A00' },
                '& label.Mui-focused': { color: '#5D3A00' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#5D3A00' },
                  '&:hover fieldset': { borderColor: '#5D3A00' },
                  '&.Mui-focused fieldset': { borderColor: '#5D3A00' },
                },
              }}
            />

            {form.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {form.errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: '#5D3A00',
                '&:hover': { backgroundColor: '#3e2600' },
              }}
            >
              Log In
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              No account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ color: '#191970', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Sign up here!
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Box className="home-joke-banner">
        <JokeDisplay />
      </Box>
    </>
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

