import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../utils/api";
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

  /* ---------------- SAFETY CHECK ---------------- */
  useEffect(() => {
    if (!mechanicId || !userLocation) {
      Swal.fire("Error", "Invalid page access", "error");
      navigate("/");
    }
  }, [mechanicId, userLocation, navigate]);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!mechanicId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await api.post("/mechanic/profile", {
          mechanicId,
        });

        setData(res.data?.data || null);
      } catch (error) {
        Swal.fire("Error", "Failed to load mechanic profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mechanicId]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading mechanic profile...
      </div>
    );
  }

  /* ---------------- NO DATA ---------------- */
  if (!data || !data.Mechanic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        No mechanic data found 😔
      </div>
    );
  }

  const mechanic = data.Mechanic;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-500 rounded"
      >
        ⬅ Back
      </button>

      <div className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-6 shadow-xl">
        
        {/* Header */}
        <h2 className="text-2xl font-bold">{mechanic.Mechanic_Name}</h2>
        <p className="text-white/70 mb-4">
          🏪 {mechanic.Mechanic_Shop_Name}
        </p>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <p>📞 Phone: {mechanic.phone}</p>
          <p>🚗 Vehicle Type: {mechanic.vehicleType}</p>
          <p>
            🟢 Status:{" "}
            <span
              className={
                mechanic.isAvailable ? "text-green-400" : "text-red-400"
              }
            >
              {mechanic.isAvailable ? "Available" : "Not Available"}
            </span>
          </p>

          <hr className="border-white/20 my-4" />

          <p>🛠 Experience: {data.experience} years</p>
          <p>⭐ Rating: {data.rating}</p>
          <p>⏰ Working Hours: {data.working_hours}</p>
          <p>🔧 Services: {data.services}</p>
          <p className="text-white/80">ℹ️ {data.about}</p>
        </div>

        {/* Map */}
        <div className="mt-8 h-96 w-full rounded-xl overflow-hidden">
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
