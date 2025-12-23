import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const MechanicList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ data from previous page
  const categoryId = state?.categoryId;
  const categoryName = state?.categoryName;
  const userLocation = state?.userLocation;

  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  /* ---------------- SAFETY CHECK ---------------- */
  useEffect(() => {
    if (!categoryId || !userLocation) {
      Swal.fire("Error", "Invalid page access", "error");
      navigate("/");
    }
  }, [categoryId, userLocation, navigate]);

  /* ---------------- FETCH MECHANICS ---------------- */
  useEffect(() => {
    if (!categoryId || !userLocation) return;

    const fetchMechanics = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3001/api/mechanics/by-category",
          {
            categoryId,
            lat: userLocation.lat,
            lng: userLocation.lng,
            limit: 10,
            offset: 0,
          }
        );

        setMechanics(res.data.mechanics || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load mechanics", "error");
      }
    };

    fetchMechanics();
  }, [categoryId, userLocation]);

  /* ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(2);
      setExpanded(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- FILTER MECHANICS ---------------- */
  const filteredMechanics = mechanics.filter(
    (m) =>
      m.Mechanic_Name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.Mechanic_Shop_Name
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase())
  );

  /* ---------------- SHOW MORE / LESS ---------------- */
  const handleToggle = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Login Required",
        text: "Please register to see more mechanics",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Register",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) navigate("/signup");
      });
      return;
    }

    if (expanded) {
      setVisibleCount(2);
      setExpanded(false);
    } else {
      setVisibleCount((prev) => prev + 5);
      setExpanded(true);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-500 rounded"
      >
        ⬅ Back
      </button>

      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center mb-3">
        {categoryName} Mechanics Near You
      </h2>
      <p className="text-center text-sm text-white/70 mb-8">
        Search nearby mechanics 🔧
      </p>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search mechanic or shop name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-white/10 text-white placeholder-white/70 outline-none"
        />
      </div>

      {/* Mechanic Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMechanics.length > 0 ? (
          filteredMechanics.slice(0, visibleCount).map((m) => (
            <div
              key={m.Mechanic_Id}
              onClick={() =>
                navigate("/mechanic-profile", {
                  state: {
                    mechanicId: m.Mechanic_Id,
                    userLocation,
                  },
                })
              }
              className="rounded-2xl bg-white/10 p-5 shadow-xl cursor-pointer hover:bg-white/20 transition"
            >
              <h3 className="text-lg font-bold">{m.Mechanic_Name}</h3>
              <p className="text-sm text-white/70">
                🏪 {m.Mechanic_Shop_Name}
              </p>
              <p>📞 {m.phone}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-white/70">
            No mechanic found 😔
          </p>
        )}
      </div>

      {/* Show More / Less */}
      {filteredMechanics.length > 2 && (
        <div className="text-center mt-10">
          <button
            onClick={handleToggle}
            className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition font-semibold"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MechanicList;
