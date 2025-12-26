import { useEffect, useState, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import useDebounce from "../hooks/useDebounce";
import axios from "axios"; 

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search);

  /* ---------------- ICON HANDLER ---------------- */
  const getIcon = useCallback((name) => {
    switch (name.toLowerCase()) {
      case "car": return "🚗";
      case "bike": return "🏍️";
      case "bus": return "🚌";
      case "truck": return "🚚";
      case "auto": return "🛺";
      case "tractor": return "🚜";
      default: return "🔧";
    }
  }, []);

  /* ---------------- REVERSE GEOCODING (CACHED) ---------------- */
  const fetchLocationName = async (lat, lng) => {
    const cacheKey = `addr_${lat.toFixed(3)}_${lng.toFixed(3)}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setAddress(cached);
      return;
    }

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: { lat, lon: lng, format: "json" },
        }
      );

      const addr = res.data.address;

      const area =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        "";

      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        "";

      const finalAddress =
        area && city ? `${area}, ${city}` : city || area || "Unknown Location";

      setAddress(finalAddress);
      localStorage.setItem(cacheKey, finalAddress);
    } catch {
      setAddress("Location unavailable");
    }
  };

  /* ---------------- GEO LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchLocationName(latitude, longitude);
      },
      () => {
        Swal.fire(
          "Permission Denied",
          "Allow location access to find nearby mechanics",
          "warning"
        );
      }
    );
  }, []);

  /*  FETCH CATEGORIES (AXIOS INSTANCE)  */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/categories");

        const data = res.data.categories.map((cat) => ({
          id: cat.Category_Id,
          name: cat.Category_Name,
          icon: getIcon(cat.Category_Name),
        }));

        setCategories(data);
      } catch {
        Swal.fire("Error", "Could not fetch categories", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getIcon]);

  /* ---------------- FILTERED LIST ---------------- */
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [categories, debouncedSearch]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    const res = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (res.isConfirmed) {
      await api.post("/user/logout");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  /* ---------------- CARD CLICK ---------------- */
  const handleCardClick = (cat) => {
    if (!location.lat || !location.lng) {
      Swal.fire("Error", "Location not available", "warning");
      return;
    }

    navigate("/mechanics", {
      state: {
        categoryId: cat.id,
        categoryName: cat.name,
        userLocation: location,
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 rounded-lg"
      >
        Logout
      </button>

      <h1 className="text-3xl text-center mb-2">
        Find Nearby Mechanic
      </h1>

      {address && (
        <p className="text-center text-white/70 mb-8">
          📍 {address}
        </p>
      )}

      <div className="max-w-md mx-auto mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vehicle type..."
          className="w-full px-5 py-3 rounded-full bg-white/10"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.length ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat)}
                className="h-36 bg-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition"
              >
                <span className="text-4xl">{cat.icon}</span>
                <p className="mt-2">{cat.name}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">
              No category found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
