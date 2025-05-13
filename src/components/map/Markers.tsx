import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";
import EditPropertyModal from "@/components/modals/EditPropertyModal";
import DeletePropertyModal from "@/components/modals/DeletePropertyModal";
import { Button } from "@/components/ui/button";

type PropertyProps = {
  created_at: Date
  id: string
  image_url: string
  latitude: number
  longitude: number
  price: number
  user_id: string
}

export default function Markers() {
  const [editingProperty, setEditingProperty] = React.useState<PropertyProps | null>(null);
  const [deletingProperty, setDeletingProperty] = React.useState<PropertyProps | null>(null);

  const { data: properties } = useQuery<PropertyProps[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError) return [];

      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) {
        throw new Error(error.message);
      }

      return properties;
    },
  });

  return (
    <>
      {properties?.map((property) => (
        <AdvancedMarker key={property.id} position={{ lat: property.latitude, lng: property.longitude }}>
          <CustomMarker
            property={property}
            onEdit={() => setEditingProperty(property)}
            onDelete={() => setDeletingProperty(property)}
          />
        </AdvancedMarker>
      ))}
      {editingProperty && (
        <EditPropertyModal
          isOpen={true}
          onClose={() => setEditingProperty(null)}
          property={editingProperty}
        />
      )}
      {deletingProperty && (
        <DeletePropertyModal
          isOpen={true}
          onClose={() => setDeletingProperty(null)}
          property={deletingProperty}
        />
      )}
    </>
  );
}

type CustomMarkerProps = {
  property: PropertyProps;
  onEdit: () => void;
  onDelete: () => void;
};

function CustomMarker({ property, onEdit, onDelete }: CustomMarkerProps) {
  const [hovered, setHovered] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="bg-white p-2 rounded-full border-2 border-black text-black font-bold text-xs flex justify-center items-center z-10"
      >
        Rp. {formatPrice(property.price)}
      </div>

      {hovered && (
        <div
          className="absolute top-[-120px] left-1/2 transform -translate-x-1/2 w-48 bg-black bg-opacity-80 rounded-lg p-3 z-20 flex flex-col items-center"
        >
          <img
            src={property.image_url}
            alt={`Property ${property.id}`}
            className="w-44 h-28 object-cover rounded-lg mb-2"
          />
          <div className="text-white text-sm font-semibold mb-2">
            Rp. {formatPrice(property.price)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white text-black hover:bg-gray-100"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-red-500 text-white hover:bg-red-600 border-red-500"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
