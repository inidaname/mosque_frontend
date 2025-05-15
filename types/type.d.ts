interface LocationType {
  eidTime: string;
  jummahTime: string;
}

interface MosqueType {
  id: number;
  name: string;
  address: string;
  eidTime: string;
  jummahTime: string;
  lat: number;
  lng: number;
}

type PrayerType = "eid" | "jummah";

type GroupLocationsByTime = (
  locations: LocationType[],
  prayerType: PrayerType
) => [string, any][];

interface UserProps {
  lat: number;
  lng: number;
  isDefault?: boolean;
}

interface RouteInfo {
  distance: number | string;
  time: string | number;
}

interface MapContProps {
  center?: LatLngExpression;
  userLocation: UserProps | null;
  destination: MosqueType | null;
  setRouteInfo: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
}

interface MapComponentProps {
  mapCenter?: LatLngExpression;
  userLocation: UserProps | null;
  selectedLocation: MosqueType | null;
  filteredLocations: MosqueType[];
  handleLocationSelect: (location: MosqueType) => void;
  setRouteInfo: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
  isAddingMosque: boolean;
  handleMapClick: (latlng: any) => void;
  prayerType: PrayerType | string;
}
