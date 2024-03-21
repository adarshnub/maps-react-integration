import React, { useEffect, useState } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState([9.5623805, 76.6294665]);

  const [shopLocations] = useState([
    { name: "kovalam", latlng: [8.4004, 76.978] },
    { name: "waterfalls", latlng: [10.2835, 76.5682] },
    { name: "kochi", latlng: [9.9667, 76.2444] },
    { name: "wildlife", latlng: [11.6859, 76.2721] },
    { name: "munnar", latlng: [10.0889, 77.0595] },
  ]);

  const [selectedShop, setSelectedShop] = useState(null);
  const [distanceToShop, setDistanceToShop] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting user location :", error);
      }
    );
  }, [userLocation]);
  console.log(userLocation, "Current location");

  const calculateDistance = (shopLatLng) => {
    if (!userLocation) return;

    const [lat1, lon1] = userLocation;
    const [lat2, lon2] = shopLatLng;

    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    setDistanceToShop(distance.toFixed(2)); // Round to 2 decimal places
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    calculateDistance(shop.latlng);
  };

  return (
    <div className="w-screen h-full">
      <div>
        <input
          type="text"
          placeholder="Search for a shop"
          onChange={(e) => handleShopSearch(e.target.value)}
        />
      </div>

      <div>
        <MapContainer
          center={userLocation}
          zoom={13}
          scrollWheelZoom={true}
          className="border-2 border-red-600 w-[400px] h-[500px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="w-full h-full"
          />
          {shopLocations.map((shop) => (
            <Marker
              key={shop.name}
              position={shop.latlng}
              onClick={() => handleShopClick(shop)}
            >
              <Popup>
                <p>{shop.name}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
