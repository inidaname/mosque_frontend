"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Icon, LatLngExpression } from "leaflet";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icon for user location
const userLocationIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "user-location-marker", // This will be styled with CSS
});

// Custom icon for default location
const defaultLocationIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "default-location-marker", // This will be styled with CSS
});

// Custom icon for new mosque location
const newMosqueIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "new-mosque-marker", // This will be styled with CSS
});

// Component to handle map center changes and routing
function MapController({
  center,
  userLocation,
  destination,
  setRouteInfo,
}: MapContProps) {
  const map = useMap();
  const [routingMachineLoaded, setRoutingMachineLoaded] = useState(false);

  // Check if Leaflet Routing Machine is loaded
  useEffect(() => {
    // Check if L.Routing exists
    if (typeof (L as any)?.Routing !== "undefined") {
      setRoutingMachineLoaded(true);
    } else {
      // If not loaded, dynamically load the script
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js";
      script.async = true;
      script.onload = () => setRoutingMachineLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // Center the map
  useEffect(() => {
    if (center && map) {
      map.setView(center, 13);
    }
  }, [center, map]);

  // Handle routing
  useEffect(() => {
    let routingControl = null;

    // Only proceed if all dependencies are available
    if (
      routingMachineLoaded &&
      map &&
      userLocation &&
      destination &&
      (L as any).Routing
    ) {
      try {
        // Remove any existing routing control
        if ((map as any)._routingControl) {
          map.removeControl((map as any)._routingControl);
        }

        // Create new routing control
        routingControl = (L as any).Routing.control({
          waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(destination.lat, destination.lng),
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: "#6366F1", weight: 5 }],
          },
          createMarker: () => null, // Don't create default markers
        });

        // Add to map
        routingControl.addTo(map)(
          // Store the routing control on the map instance
          map as any
        )._routingControl = routingControl;

        // Get route information
        routingControl.on("routesfound", (e: any) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const summary = routes[0].summary;
            setRouteInfo({
              distance: (summary.totalDistance / 1000).toFixed(2), // km
              time: Math.round(summary.totalTime / 60), // minutes
            });
          }
        });
      } catch (error) {
        console.error("Error setting up routing:", error);
      }
    }

    return () => {
      if (routingControl && map) {
        try {
          map.removeControl(routingControl);
        } catch (error) {
          console.error("Error removing routing control:", error);
        }
      }
    };
  }, [routingMachineLoaded, userLocation, destination, map, setRouteInfo]);

  return null;
}

// Component to handle map clicks for adding new mosques
function MapClickHandler({
  isAddingMosque,
  handleMapClick,
}: {
  isAddingMosque: boolean;
  handleMapClick: (e: L.LatLng) => void;
}) {
  const map = useMapEvents({
    click: (e) => {
      if (isAddingMosque) {
        handleMapClick(e.latlng);
      }
    },
  });

  return null;
}

export default function MapComponent({
  mapCenter,
  userLocation,
  selectedLocation,
  filteredLocations,
  handleLocationSelect,
  setRouteInfo,
  isAddingMosque,
  handleMapClick,
  prayerType,
}: MapComponentProps) {
  const [mapClickPosition, setMapClickPosition] = useState<L.LatLng | null>(
    null
  );

  // Update map click position when adding a mosque
  useEffect(() => {
    if (!isAddingMosque) {
      setMapClickPosition(null);
    }
  }, [isAddingMosque]);

  return (
    <div className="flex-1 h-[50vh] md:h-auto z-20 hidden ">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController
          center={mapCenter}
          userLocation={userLocation}
          destination={selectedLocation}
          setRouteInfo={setRouteInfo}
        />
        <MapClickHandler
          isAddingMosque={isAddingMosque}
          handleMapClick={(latlng) => {
            setMapClickPosition(latlng);
            handleMapClick(latlng);
          }}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={
              userLocation.isDefault ? defaultLocationIcon : userLocationIcon
            }
          >
            <Popup>
              <div>
                <h3 className="font-bold">
                  {userLocation.isDefault
                    ? "Default Location"
                    : "Your Location"}
                </h3>
                {userLocation.isDefault && (
                  <p className="text-xs mt-1">
                    This is a default location in central Abuja.
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* New mosque position marker */}
        {isAddingMosque && mapClickPosition && (
          <Marker
            position={[mapClickPosition.lat, mapClickPosition.lng]}
            icon={newMosqueIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">New Mosque Location</h3>
                <p className="text-xs mt-1">
                  Lat: {mapClickPosition.lat.toFixed(6)}, Lng:{" "}
                  {mapClickPosition.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination markers */}
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleLocationSelect(location),
            }}
          >
            <Popup>
              <div className="max-w-[200px]">
                <h3 className="font-bold text-sm">{location.name}</h3>
                <p className="text-xs mt-1">{location.address}</p>
                <div className="flex items-center mt-2 text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>
                    {prayerType === "eid"
                      ? location.eidTime
                      : location.jummahTime}
                  </span>
                </div>
                {userLocation && (
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleLocationSelect(location)}
                  >
                    Get Directions
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
