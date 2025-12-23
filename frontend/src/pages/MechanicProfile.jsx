import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import MapboxMap from "../components/Map";

const MechanicProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const mechanicId = state?.mechanicId;
  const userLocation = state?.userLocation;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapToken =
    "pk.eyJ1IjoiYW5zaHVsMTAzNCIsImEiOiJjbWpoZGI4NTkxZTI0M2NzbGJhdGZtMW1wIn0.rExgAvBKEXcnyGggH9cHPQ";

  /* ------------ SAFETY CHECK ------------ */
  useEffect(() => {
    if (!mechanicId || !userLocation) {
      Swal.fire("Error", "Invalid page access", "error");
      navigate("/");
    }
  }, [mechanicId, userLocation, navigate]);

  /* ------------ FETCH MECHANIC PROFILE ------------ */
  useEffect(() => {
    if (!mechanicId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3001/api/mechanic/profile",
          { mechanicId } // ✅ correct key
        );

        setData(res.data.data); // ✅ correct response access
      } catch (err) {
        Swal.fire("Error", "Failed to load mechanic profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mechanicId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!data || !data.Mechanic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        No Data Found
      </div>
    );
  }

  const mechanic = data.Mechanic;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-500 rounded"
      >
        ⬅ Back
      </button>

      <div className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold">{mechanic.Mechanic_Name}</h2>
        <p className="text-white/70 mb-4">🏪 {mechanic.Mechanic_Shop_Name}</p>

        <div className="space-y-2 text-sm">
          <p>📞 Phone: {mechanic.phone}</p>
          <p>🚗 Vehicle Type: {mechanic.vehicleType}</p>
          <p>
            🟢 Status: {mechanic.isAvailable ? "Available" : "Not Available"}
          </p>

          <hr className="border-white/20 my-4" />

          <p>🛠 Experience: {data.experience} years</p>
          <p>⭐ Rating: {data.rating}</p>
          <p>⏰ Working Hours: {data.working_hours}</p>
          <p>🔧 Services: {data.services}</p>
          <p className="text-white/80">ℹ️ {data.about}</p>
        </div>

        {/* ✅ MAP (USER LOCATION PASSED) */}
        <div className="mt-8 h-96 w-full">
          <MapboxMap
            lat={mechanic.latitude}
            lng={mechanic.longitude}
            shopName={mechanic.Mechanic_Shop_Name}
            mechanicName={mechanic.Mechanic_Name}
            userLat={userLocation.lat}
            userLng={userLocation.lng}
            token={mapToken}
          />
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;
