// "use client";

import React, { SetStateAction, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Edit2, MapPin, Save, X } from "lucide-react";
import { useGetMosqueListQuery } from "@/service/endpoints/mosque-endpoints";

interface Props {
  filteredLocations: MosqueType[];
  selectedLocation: MosqueType | null;
  handleLocationSelect: (location: MosqueType) => void;
  userLocation: UserProps | null;
  prayerType: PrayerType | string;
  mosqueData: MosqueType[];
  setMosqueData: (value: SetStateAction<MosqueType[]>) => void;
  setSelectedLocation: (value: SetStateAction<MosqueType | null>) => void;
}

const MosqueList: React.FC<Props> = ({
  filteredLocations,
  selectedLocation,
  handleLocationSelect,
  userLocation,
  prayerType,
  mosqueData,
  setMosqueData,
  setSelectedLocation,
}) => {
  const { data } = useGetMosqueListQuery();
  console.log("data", data);
  // State for editing mosque time
  const [editingMosque, setEditingMosque] = useState<MosqueType | null>(null);
  const [editedTime, setEditedTime] = useState("");
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

  return (
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
                className="absolute hidden right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
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
  );
};

export default MosqueList;
