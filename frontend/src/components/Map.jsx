import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxMap = ({ lat, lng, shopName, mechanicName, userLat, userLng, token }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!lat || !lng || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [parseFloat(lng), parseFloat(lat)],
      zoom: 14,
    });

    const bounds = new mapboxgl.LngLatBounds();

    // Mechanic popup + marker
    const mechanicPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="color: white; background: #d32f2f; padding: 5px; border-radius: 5px;">
        <strong>Mechanic Info 🛠</strong><br/>
        <p>Shop: ${shopName}</p>
        <p>Name: ${mechanicName}</p>
      </div>
    `);

    const mechanicMarker = new mapboxgl.Marker({ color: "#d32f2f" }) // red
      .setLngLat([parseFloat(lng), parseFloat(lat)])
      .setPopup(mechanicPopup)
      .addTo(map);

    bounds.extend([parseFloat(lng), parseFloat(lat)]);

    // User popup + marker
    if (userLat && userLng) {
      const userPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: white; background: #1976d2; padding: 5px; border-radius: 5px;">
          <strong>Your Location 📍</strong><br/>
          <p>This is where you are</p>
        </div>
      `);

      const userMarker = new mapboxgl.Marker({ color: "#1976d2" }) // blue
        .setLngLat([parseFloat(userLng), parseFloat(userLat)])
        .setPopup(userPopup)
        .addTo(map);

      bounds.extend([parseFloat(userLng), parseFloat(userLat)]);
    }

    // Fit map to show both markers
    if (userLat && userLng) {
      map.fitBounds(bounds, { padding: 100 });
    }

    return () => map.remove();
  }, [lat, lng, shopName, mechanicName, userLat, userLng, token]);

  return <div ref={mapContainer} className="h-full w-full rounded-2xl" />;
};

export default MapboxMap;
