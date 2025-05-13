'use client'

import CreatePropertyModal from "@/components/modals/CreatePropertyModal";
import Markers from "@/components/map/Markers";
import { AdvancedMarker, APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_MAPS_KEY ?? ""

export default function ClickableMap() {
  const [modalPosition, setModalPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setModalPosition({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId='PropertyMap'
        style={{ width: '80vw', height: '80vh' }}
        defaultCenter={{
          lat: -6.2088,
          lng: 106.8456,
        }}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        onClick={handleMapClick}
      >
        <Markers />
        <TemporaryMarker position={modalPosition} />
      </Map>
      <CreatePropertyModal
        isOpen={modalPosition !== null}
        onClose={() => setModalPosition(null)}
        position={modalPosition ?? { lat: 0, lng: 0 }}
      />
    </APIProvider>
  );
}

function TemporaryMarker({ position }: { position: { lat: number; lng: number } | null }) {
  if (!position) return null;

  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white opacity-50 animate-ping" />
      </div>
    </AdvancedMarker>
  );
}
