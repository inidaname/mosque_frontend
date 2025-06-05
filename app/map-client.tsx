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
import {
  AddMosqueForm,
  type AddMosqueFormValues,
} from "@/templates/add-mosque-form";
import { LatLngExpression } from "leaflet";
import MosqueList from "@/templates/mosque-list";

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
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0784,
    lng: 7.4753,
  },
  {
    id: 3,
    name: "APO LEGISLATIVE",
    address: "Central Mosque, APO Legislative Quarters, Zone E.",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.0292,
    lng: 7.4893,
  },
  {
    id: 4,
    name: "JIBWIS HEADQUARTERS",
    address: "Utako Berger, Abuja",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0741,
    lng: 7.4452,
  },
  {
    id: 5,
    name: "GWARIMPA",
    address: "Gwarimpa Eid Ground",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.1167,
    lng: 7.4167,
  },
  {
    id: 6,
    name: "NURUL YAQEEN",
    address:
      "Nurul Yaqeen Mosque, Plot 268, Kafe, Life Camp, Opp. Godab Estate.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0941,
    lng: 7.4059,
  },
  {
    id: 7,
    name: "DUTSE BAUMPA",
    address:
      "By Shafa Energy, Tipper Garage Bmuko Junction, along Dutse - Bwari Road.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1528,
    lng: 7.3444,
  },
  {
    id: 8,
    name: "ANSAR-UD-DEEN",
    address: "Ansar-ud-deen Mosque No 80 Aguiyi Ironsi Street Wuse 2.",
    eidTime: "08:30am", // Assuming time based on similar locations
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
    name: "Al-HABIBIYYAH MOSQUE",
    address:
      "Al-habibiyyah Mosque, Plot 753, Babagana Kingibe Street Guzape, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0437,
    lng: 7.5048,
  },
  {
    id: 11,
    name: "BANEX PLAZA",
    address: "Uthman Bin Affan Mosque, (Banex Plaza), Wuse 2.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0784,
    lng: 7.4753,
  },
  {
    id: 12,
    name: "CITEC EID GROUND",
    address: "Citec Estate, along Idu-Junction, Mbora Distric, Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 13,
    name: "Al-HUDA MASJID",
    address:
      "Al-Huda Masjid Premises, Uwadia Resorts of Millionaires Quarters, Byazhin-Kubwa.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 14,
    name: "AL-IKHLAS MASJID",
    address: "FCDA Owner Occupier Estate, Kubwa, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 15,
    name: "OLD BERGER",
    address: "Old Berger Yard, Airport Road, Lugbe, Abuja",
    eidTime: "08:15am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 16,
    name: "AIRPORT MASJID",
    address: "Praying Ground, AREA B, Airport Masjid.",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 17,
    name: "MASJID ABUBAKAR SIDDIQUE",
    address: "Masjid Abubakar Siddique, Wuse Zone 6, Abuja.",
    eidTime: "08:45am",
    jummahTime: "01:30pm",
    lat: 9.0784,
    lng: 7.4753,
  },
  {
    id: 18,
    name: "JEDO ESTATE",
    address: "Jumma'ah Masjid, Jedo Estate, Along Airport Road Abuja.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 19,
    name: "ZUMA BARRACKS",
    address:
      "Ibn Abbas Masjid, Besides Zuma Barracks, Along Abuja-Kaduna Expressway, Suleja.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.1833,
    lng: 7.1833,
  },
  {
    id: 20,
    name: "FOMWAN",
    address: "Fomwan Headquarters Central Mosque, Utako",
    eidTime: "08:45am",
    jummahTime: "01:30pm",
    lat: 9.0741,
    lng: 7.4452,
  },
  {
    id: 21,
    name: "MUSLIM COMMUNITY KUBWA",
    address: "Muslim Community Central Mosque, Shelter Farm Kubwa.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 22,
    name: "DAMBATTA MASJID",
    address: "Dambatta masjid, No23 Kaltungo street Garki II.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0333,
    lng: 7.4833,
  },
  {
    id: 23,
    name: "AMSSCO ESTATE",
    address: "Anas Ibn Malik Islamic Centre, AMSSCO Estate, Galadimawa, Abuja.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 24,
    name: "KUBWA MUSLIM COMMUNITY",
    address: "Kubwa Muslim Community Eid Ground, Phase 3 Junction, Kubwa.",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 25,
    name: "JIBWIS ISLAMIC CENTER",
    address: "Adamu Alieru Crescent, Guzape, Abuja.",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.0437,
    lng: 7.5048,
  },
  {
    id: 26,
    name: "JIBWIS FCT",
    address: "DAWAKI Extension, News Engineering",
    eidTime: "08:00am",
    jummahTime: "01:30pm",
    lat: 9.1167,
    lng: 7.4167,
  },
  {
    id: 27,
    name: "CHIKA JUMA'AT MOSQUE",
    address:
      "Chika juma'at Mosque Muslims Initiative, Along Airport Road, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 28,
    name: "AREA 8 MASJID",
    address: "Area 8 Masjid section 1, Sheda Close Garki Abuja.",
    eidTime: "08:30am",
    jummahTime: "01:30pm",
    lat: 9.0333,
    lng: 7.4833,
  },
  {
    id: 29,
    name: "SUNNYVALE HOMES MASJID",
    address:
      "Sunnyvale Homes Sports Complex (near old gate), Dakwo District, Abuja.",
    eidTime: "09:00am",
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 30,
    name: "MAMBILLA BARRACKS",
    address:
      "Guards Brigade Garrison Parade Ground, Mambilla Barracks, Asokoro.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0437,
    lng: 7.5048,
  },
  {
    id: 31,
    name: "ABACHA BARRACKS",
    address: "Mugadishu Cantonment, Abacha Barracks (Parade ground).",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 32,
    name: "OTM MASJID",
    address: "OTM Masjid, Promenade/Kwankwaso Estate Lokogoma, Cluster 5",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 33,
    name: "NATIONAL ASSEMBLY",
    address: "National Assembly Central Mosque",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0579,
    lng: 7.4951,
  },
  {
    id: 34,
    name: "WUYE CENTRAL MASJID",
    address: "Wuye Central Masjid, Wuye District, FCT Abuja",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 35,
    name: "JIBWIS GBAZANGO KUBWA",
    address:
      "JIBWIS Prayer Ground @ NYSC Junction by the Express, Gbazango, Kubwa, Abuja",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 36,
    name: "PEGI MUSLIM COMMUNITY",
    address: "Pegi Muslim Community, Pegi Kuje. Eid Praying Ground.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 37,
    name: "CYCLIC ENERGY LTD",
    address: "Cyclic Airport Road",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 38,
    name: "ESTEEM BOYS' COLLEGE",
    address: "Esteem Boys' College, Lokogoma",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 39,
    name: "ANSAR-DEEN",
    address: "Ansar-Deen Gwarimpa Mosque",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1167,
    lng: 7.4167,
  },
  {
    id: 40,
    name: "GWARIMPA MSS MASJID",
    address: "Abdullateef Adegbite Jumua Masjid (MSS), 1st Avenue, Gwarimpa",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1167,
    lng: 7.4167,
  },
  {
    id: 41,
    name: "KUDURU MUSLIM COMMUNITY",
    address:
      "KMC, Kuduru Muslim Community at GSS Kuduru Premises, Bwari - Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.2833,
    lng: 7.3833,
  },
  {
    id: 42,
    name: "ANOOR ISLAMIC CENTRE MASJID",
    address:
      "Anoor Islamic Centre Masjid/Crescent Pearls Leadership Academy CPLA, Plot 107, Cadastral C20. Behind Nizamiye Turkish Hospital Mbora District, Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 43,
    name: "FEDERAL HOUSING AUTHORITY MOSQUE",
    address: "Federal housing authority Mosque Asokoro, Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0437,
    lng: 7.5048,
  },
  {
    id: 44,
    name: "ANSAR-UD-DEEN KUBWA",
    address:
      "Ansar-ud-Deen Central Mosque, at Off Arab Road by Mango tree, Kubwa Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 45,
    name: "SUNCITY ESTATE",
    address: "Suncity Estate Juma'at Masjeed",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 46,
    name: "MAITAMA CENTRAL MOSQUE",
    address: "Maitama Central Mosque. No 120 Nile Street.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0824,
    lng: 7.4959,
  },
  {
    id: 47,
    name: "NASFAT ISLAMIC CENTRE",
    address:
      "NASFAT Islamic Centre, plot 313 Augustus Alkhomu Way, UTAKO District, Abuja",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0741,
    lng: 7.4452,
  },
  {
    id: 48,
    name: "KUBWA",
    address: "FO1 Eid Ground, Kubwa",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1667,
    lng: 7.3333,
  },
  {
    id: 49,
    name: "AYA CENTRAL MOSQUE",
    address: "A Y A Asokoro Central mosque",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0437,
    lng: 7.5048,
  },
  {
    id: 50,
    name: "BMUKO MUSLIM COMMUNITY",
    address:
      "Bmuko Muslim Community, Off Tipper Garage, Dutse, off Bwari Expressway, Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.1528,
    lng: 7.3444,
  },
  {
    id: 51,
    name: "SHEHU SHAGARI CENTRAL MOSQUE",
    address: "Mosque premises, Section 2, Area 1, Garki Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0333,
    lng: 7.4833,
  },
  {
    id: 52,
    name: "ANWARU -L-HUDA",
    address:
      "Anwaru -L-Huda League of Nigeria (AHLON), Area 1, Section 1, Garki, Abuja.",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0333,
    lng: 7.4833,
  },
  {
    id: 53,
    name: "SUNUSI DANTATA",
    address: "Sunusi Dantata Juma'at Mosque Central Area",
    eidTime: "08:30am", // Assuming time based on similar locations
    jummahTime: "01:30pm",
    lat: 9.0579,
    lng: 7.4951,
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
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Mosque</DialogTitle>
                    <DialogDescription>
                      Fill in the details below or click on the map to set the
                      location.
                    </DialogDescription>
                  </DialogHeader>

                  <AddMosqueForm
                    // onSubmit={handleAddMosque}
                    mosqueData={mosqueData}
                    setIsAddingMosque={setIsAddingMosque}
                    setMosqueData={setMosqueData}
                    setMapClickLocation={setMapClickLocation}
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
            <MosqueList
              filteredLocations={filteredLocations}
              handleLocationSelect={handleLocationSelect}
              prayerType={prayerType}
              selectedLocation={selectedLocation}
              userLocation={userLocation}
              mosqueData={mosqueData}
              setMosqueData={setMosqueData}
              setSelectedLocation={setSelectedLocation}
            />
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
