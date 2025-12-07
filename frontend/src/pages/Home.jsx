import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const navigate = useNavigate();

  // --- 1. Fetch nearby mechanics ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;

          try {
            const response = await axios.get(
              "http://localhost:3001/api/mechanics/nearby",
              {
                params: { lat, lng: long, radius: 300 },
              }
            );
            console.log("API response:", response.data);
            setMechanics(response.data.mechanics);
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.log("Location failed", err);
          setLocationError(true);
          setLoading(false);
        }
      );
    } else {
      setLocationError(true);
      setLoading(false);
    }
  }, []);

  // --- 2. Debounce search input ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); 
    }, 900); 

    return () => clearTimeout(handler);
  }, [search]);

  //Filter mechanics using debounced search ---
  const filteredMechanics = mechanics.filter((m) =>
    m.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Nearby Mechanics
      </h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search mechanic..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* Location error */}
      {locationError && (
        <p style={{ textAlign: "center", color: "red" }}>
          Could not fetch location. Please allow location access!
        </p>
      )}

      {/* Mechanics list */}
      {!loading && !locationError && filteredMechanics.length > 0 ? (
        <>
          {filteredMechanics.slice(0, 5).map((m, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
            >
              <h4 style={{ marginBottom: "8px" }}>{m.name}</h4>
              <p style={{ margin: "5px 0" }}>Service: {m.serviceType}</p>
              <p style={{ margin: "5px 0" }}>📞 {m.phone}</p>
            </div>
          ))}

          {/* Show More button */}
          {filteredMechanics.length > 5 && (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 25px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "block",
                margin: "20px auto",
                fontSize: "16px",
              }}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        !loading &&
        !locationError && (
          <p style={{ textAlign: "center", color: "#555", marginTop: "20px" }}>
            Data not found
          </p>
        )
      )}
    </div>
  );
}

export default Home;
