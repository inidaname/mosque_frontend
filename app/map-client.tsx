"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Route,
  Calendar,
  Plus,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AddMosqueForm, type AddMosqueFormValues } from "./add-mosque-form";
import { LatLngExpression } from "leaflet";

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 h-[50vh] md:h-auto flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading map...</p>
      </div>
    </div>
  ),
});

// Initial mosque data
const initialMosqueData: MosqueType[] = [
  {
    id: 1,
    name: "NATIONAL EID GROUND",
    address: "National Eid ground, Along Airport Road, After City Gate.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 2,
    name: "AN-NOOR",
    address: "Al- Noor Masjid. Wuse 2 Abuja.",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.0784,
    lng: 7.4753,
  },
  {
    id: 3,
    name: "APO LEGISLATIVE",
    address: "APO Legislative Quarters Mosque, Zone E.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0292,
    lng: 7.4893,
  },
  {
    id: 4,
    name: "JIBWIS HEADQUARTERS",
    address: "Utako Berger, Abuja",
    eidTime: "09:30am",
    jummahTime: "01:30pm",
    lat: 9.0741,
    lng: 7.4452,
  },
  {
    id: 5,
    name: "GWARIMPA",
    address: "Gwarimpa Eid Ground",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1167,
    lng: 7.4167,
  },
  {
    id: 6,
    name: "NURUL YAQEEN",
    address:
      "Nurul Yaqeen Mosque, Plot 268, Kafe, Life Camp, Opp. Godab Estate.",
    eidTime: "09:30am",
    jummahTime: "01:30pm",
    lat: 9.0941,
    lng: 7.4059,
  },
  {
    id: 7,
    name: "DUTSE BAUMPA",
    address:
      "By Shafa Energy, Tipper Garage Bmuko Junction, along Dutse - Bwari Road.",
    eidTime: "09:30am",
    jummahTime: "01:30pm",
    lat: 9.1528,
    lng: 7.3444,
  },
  {
    id: 8,
    name: "ANSAR-UD-DEEN",
    address: "Ansar-ud-deen Mosque No 80 Agaiyi Ironsi Street Wuse 2.",
    eidTime: "10:00am",
    jummahTime: "01:30pm",
    lat: 9.0784,
    lng: 7.4753,
  },
  {
    id: 9,
    name: "IMF MASJID",
    address:
      "No 4 Ibrahim Maimunat Foundation (IMF) Close, FO1 Kubwa, FCT, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 10,
    name: "CITEC EID GROUND",
    address: "Citec Estate, along Idu-Junction, Mbora Distric, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 11,
    name: "Karu Mosque",
    lat: 9.092195,
    lng: 6.01759,
    address: "Citec Estate, along Idu-Junction, Mbora Distric, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
  },
  {
    id: 12,
    name: "Kuje Mosque",
    lat: 9.092195,
    lng: 6.01759,
    address: "Citec Estate, along Idu-Junction, Mbora Distric, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
  },
];

// Function to group locations by time
const groupLocationsByTime: GroupLocationsByTime = (locations, prayerType) => {
  const groups: Location | Record<string, any> = {};

  locations.forEach((location) => {
    const time = prayerType === "eid" ? location.eidTime : location.jummahTime;
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(location);
  });

  return Object.entries(groups).sort((a, b) => {
    // Convert time strings to comparable values (e.g., "08:30am" to minutes)
    const timeToMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(/([ap]m)/i);
      const [hours, minutes] = time.split(":").map(Number);
      const isPM = period.toLowerCase() === "pm";
      return ((hours % 12) + (isPM ? 12 : 0)) * 60 + minutes;
    };

    return timeToMinutes(a[0]) - timeToMinutes(b[0]);
  });
};

export default function MapClient() {
  // State for mosque data
  const [mosqueData, setMosqueData] = useState<MosqueType[]>([]);

  // State for prayer type (eid or jummah)
  const [prayerType, setPrayerType] = useState<PrayerType | string>("eid");

  // State for editing mosque time
  const [editingMosque, setEditingMosque] = useState<MosqueType | null>(null);
  const [editedTime, setEditedTime] = useState("");

  // Other state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<MosqueType | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([
    9.0765, 7.4894,
  ]); // Center of Abuja
  const [userLocation, setUserLocation] = useState<UserProps | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [timeFilter, setTimeFilter] = useState("");
  const [showManualLocationInput, setShowManualLocationInput] = useState(false);
  const [isAddingMosque, setIsAddingMosque] = useState(false);
  const [mapClickLocation, setMapClickLocation] = useState(null);

  // Load mosque data from localStorage on component mount
  useEffect(() => {
    const savedMosques = localStorage.getItem("mosqueData");
    if (savedMosques) {
      setMosqueData(JSON.parse(savedMosques));
    } else {
      setMosqueData(initialMosqueData);
    }
  }, []);

  // Set initial selected location once mosque data is loaded
  useEffect(() => {
    if (mosqueData.length > 0 && !selectedLocation) {
      setSelectedLocation(mosqueData[0]);
    }
  }, [mosqueData, selectedLocation]);

  // Update localStorage when mosque data changes
  useEffect(() => {
    if (mosqueData.length > 0) {
      localStorage.setItem("mosqueData", JSON.stringify(mosqueData));
    }
  }, [mosqueData]);

  // Filter locations based on search term and time filter
  const filteredLocations = mosqueData.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const time = prayerType === "eid" ? location.eidTime : location.jummahTime;
    const matchesTime = timeFilter ? time === timeFilter : true;

    return matchesSearch && matchesTime;
  });

  // Group locations by time
  const locationsByTime = groupLocationsByTime(
    mosqueData,
    prayerType as PrayerType
  );

  // Get user's location
  const getUserLocation = () => {
    setIsLocating(true);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setMapCenter([userPos.lat, userPos.lng]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);

          // Handle specific geolocation errors
          if (error.code === 1) {
            // Permission denied
            toast({
              title: "Location access denied",
              description: "You can manually set your location instead.",
              variant: "destructive",
            });
          } else if (error.code === 2) {
            // Position unavailable
            toast({
              title: "Position unavailable",
              description:
                "Your current position is unavailable. You can manually set your location instead.",
              variant: "destructive",
            });
          } else if (error.code === 3) {
            // Timeout
            toast({
              title: "Location timeout",
              description:
                "Getting your location timed out. You can manually set your location instead.",
              variant: "destructive",
            });
          } else {
            // Generic error or permissions policy error
            toast({
              title: "Location error",
              description:
                "Unable to get your location due to browser restrictions. You can manually set your location instead.",
              variant: "destructive",
            });
          }

          // Enable manual location setting
          setShowManualLocationInput(true);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description:
          "Your browser doesn't support geolocation. You can manually set your location instead.",
        variant: "destructive",
      });
      setIsLocating(false);
      // Enable manual location setting
      setShowManualLocationInput(true);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: MosqueType) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
  };

  // Handle manual location setting
  const handleManualLocationSet = () => {
    // For simplicity, we'll use a central Abuja location as the user's location
    const manualLocation = {
      lat: 9.0765,
      lng: 7.4894,
      isDefault: true, // Flag to indicate this is a default location
    };

    setUserLocation(manualLocation);
    setMapCenter([manualLocation.lat, manualLocation.lng]);
    setShowManualLocationInput(false);

    toast({
      title: "Default location set",
      description: "Using a default location in central Abuja.",
    });
  };

  // Handle time editing
  const startEditingTime = (mosque: MosqueType) => {
    setEditingMosque(mosque);
    setEditedTime(prayerType === "eid" ? mosque.eidTime : mosque.jummahTime);
  };

  // Save edited time
  const saveEditedTime = () => {
    if (editingMosque && editedTime) {
      const updatedMosques = mosqueData.map((mosque) => {
        if (mosque.id === editingMosque.id) {
          return {
            ...mosque,
            [prayerType === "eid" ? "eidTime" : "jummahTime"]: editedTime,
          };
        }
        return mosque;
      });

      setMosqueData(updatedMosques);

      // Update selected location if it's the one being edited
      if (selectedLocation && selectedLocation.id === editingMosque.id) {
        const updatedLocation = updatedMosques.find(
          (m) => m.id === editingMosque.id
        );
        setSelectedLocation(updatedLocation ?? null);
      }

      setEditingMosque(null);
      setEditedTime("");

      toast({
        title: "Time updated",
        description: `${editingMosque.name} ${
          prayerType === "eid" ? "Eid" : "Jummah"
        } time updated to ${editedTime}.`,
      });
    }
  };

  // Cancel time editing
  const cancelEditingTime = () => {
    setEditingMosque(null);
    setEditedTime("");
  };

  // Handle form submission for adding new mosque
  const handleAddMosque = (data: AddMosqueFormValues) => {
    const newMosque = {
      id: Date.now(), // Use timestamp as ID
      ...data,
    };

    setMosqueData([...mosqueData, newMosque]);
    setIsAddingMosque(false);
    setMapClickLocation(null);

    toast({
      title: "Mosque added",
      description: `${newMosque.name} has been added to the map.`,
    });
  };

  // Handle map click for adding new mosque
  const handleMapClick = (latlng: any) => {
    if (isAddingMosque) {
      setMapClickLocation(latlng);
    }
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 p-4 overflow-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Prayer Locations</span>
              <Dialog open={isAddingMosque} onOpenChange={setIsAddingMosque}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Mosque
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] z-100">
                  <DialogHeader>
                    <DialogTitle>Add New Mosque</DialogTitle>
                    <DialogDescription>
                      Fill in the details below or click on the map to set the
                      location.
                    </DialogDescription>
                  </DialogHeader>

                  <AddMosqueForm
                    onSubmit={handleAddMosque}
                    mapClickLocation={mapClickLocation}
                  />
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>FCT Abuja</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue="jumma"
              value={prayerType}
              onValueChange={setPrayerType}
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="eid">Eid Prayers</TabsTrigger>
                <TabsTrigger value="jummah">Jummah Prayers</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={getUserLocation}
              className="w-full mb-4"
              disabled={isLocating}
              variant="outline"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {isLocating
                ? "Getting location..."
                : userLocation
                ? "Update My Location"
                : "Use My Location"}
            </Button>

            {showManualLocationInput && (
              <div className="mb-4 p-3 border rounded-md bg-muted/20">
                <p className="text-sm mb-2">
                  Unable to access your location automatically. Click below to
                  use a default location in central Abuja:
                </p>
                <Button
                  onClick={handleManualLocationSet}
                  className="w-full"
                  variant="default"
                >
                  Use Default Location
                </Button>
              </div>
            )}

            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search locations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">
                Filter by prayer time:
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={timeFilter === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setTimeFilter("")}
                >
                  All Times
                </Badge>
                {locationsByTime.map(([time]) => (
                  <Badge
                    key={time}
                    variant={timeFilter === time ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimeFilter(time)}
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div key={location.id} className="relative">
                    <Button
                      variant={
                        selectedLocation && selectedLocation.id === location.id
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start text-left flex-col items-start h-auto py-3 pr-10"
                      onClick={() => handleLocationSelect(location)}
                      disabled={!userLocation}
                    >
                      <div className="flex items-center w-full">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{location.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 ml-6 w-full text-left">
                        {location.address}
                      </div>
                      <div className="flex items-center mt-1 ml-6">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">
                          {editingMosque && editingMosque.id === location.id ? (
                            <div className="flex items-center">
                              <Input
                                value={editedTime}
                                onChange={(e) => setEditedTime(e.target.value)}
                                className="h-6 py-0 px-1 text-xs w-20 mr-2"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 p-0"
                                onClick={saveEditedTime}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 p-0"
                                onClick={cancelEditingTime}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : prayerType === "eid" ? (
                            location.eidTime
                          ) : (
                            location.jummahTime
                          )}
                        </span>
                      </div>
                    </Button>
                    {!(editingMosque && editingMosque.id === location.id) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTime(location);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No locations match your search
                </div>
              )}
            </div>
          </CardContent>

          {routeInfo && userLocation && selectedLocation && (
            <CardFooter className="flex flex-col items-start border-t p-4">
              <div className="font-medium mb-2">
                Route to {selectedLocation.name}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Route className="mr-2 h-4 w-4" />
                <span>Distance: {routeInfo.distance} km</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Clock className="mr-2 h-4 w-4" />
                <span>Estimated travel time: {routeInfo.time} minutes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Prayer time:{" "}
                  {selectedLocation &&
                    (prayerType === "eid"
                      ? selectedLocation.eidTime
                      : selectedLocation.jummahTime)}
                </span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Map */}
      <MapComponent
        mapCenter={mapCenter}
        userLocation={userLocation}
        selectedLocation={selectedLocation}
        filteredLocations={filteredLocations}
        handleLocationSelect={handleLocationSelect}
        setRouteInfo={setRouteInfo}
        isAddingMosque={isAddingMosque}
        handleMapClick={handleMapClick}
        prayerType={prayerType}
      />

      <Toaster />
    </div>
  );
}
