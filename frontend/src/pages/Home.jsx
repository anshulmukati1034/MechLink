import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const navigate = useNavigate();

  /* -------------- GEO LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Geolocation Not Supported",
        text: "Your browser does not support location services.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        Swal.fire({
          icon: "warning",
          title: "Location Permission Denied",
          text: "Please allow location access to find nearby mechanics.",
          confirmButtonColor: "#2563eb",
        });
      }
    );
  }, []);

  /* -------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/categories"); // tumhara API route
        const data = res.data.categories.map((cat) => ({
          id: cat.Category_Id,
          name: cat.Category_Name,
          icon: getIcon(cat.Category_Name),
        }));
        setCategories(data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "API Error",
          text: "Could not fetch categories.",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("http://localhost:3001/api/user/logout");
        localStorage.removeItem("token");
        Swal.fire("Logged out!", "You have been logged out.", "success");
        navigate("/login");
      } catch (error) {
        Swal.fire("Error", "Logout failed!", "error");
      }
    }
  };

  /* -------------- DEBOUNCE SEARCH ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "car":
        return "🚗";
      case "bike":
        return "🏍️";
      case "bus":
        return "🚌";
      case "truck":
        return "🚚";
      case "auto":
        return "🛺";
      case "tractor":
        return "🚜";
      default:
        return "🔧";
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCardClick = (cat) => {
    if (!location.lat || !location.lng) {
      Swal.fire({
        icon: "warning",
        title: "Location not found",
        text: "Please allow location access.",
      });
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

  return (
 <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10">
      
      {/* Logout Button - top-right */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg font-semibold transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-semibold text-center mb-3">
        Find Nearby Mechanic
      </h1>

      {location.lat && location.lng && (
        <p className="text-center text-sm text-white/70 mb-8">
          📍 Location detected
        </p>
      )}

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search vehicle type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 outline-none shadow-lg focus:ring-2 focus:ring-blue-400/60 transition"
        />
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(cat)}
              className="h-36 rounded-2xl bg-white/10 backdrop-blur-lg flex flex-col items-center justify-center cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-white/20"
            >
              <span className="text-4xl mb-2">{cat.icon}</span>
              <p className="text-lg font-medium">{cat.name}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-white/70">
            No category found
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
