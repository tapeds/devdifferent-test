import { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';

type CreatePropertyFormData = {
  price: number;
  image_url: string;
  latitude: number;
  longitude: number;
};

type CreatePropertyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  position: { lat: number; lng: number };
};

export default function CreatePropertyModal({ isOpen, onClose, position }: CreatePropertyModalProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<CreatePropertyFormData>();

  const { handleSubmit, reset } = methods

  const mutation = useMutation({
    mutationFn: async (data: CreatePropertyFormData) => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error('Not authenticated');

      const { error } = await supabase.from('properties').insert({
        ...data,
        user_id: user.user.id,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Property created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setTimeout(() => {
        onClose();
        setMessage(null);
        reset()
      }, 1500);
    },
    onError: (error: Error) => {
      setMessage({ type: 'error', text: error.message });
    },
  });

  if (!isOpen) return null;

  const formatCoordinate = (coord: number) => coord.toFixed(6);

  const onSubmit: SubmitHandler<CreatePropertyFormData> = (data) => {
    mutation.mutate({
      ...data,
      latitude: position.lat,
      longitude: position.lng
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Create New Property'
      description={`Location: ${formatCoordinate(position.lat)}, ${formatCoordinate(position.lng)}`}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (Rp)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter property price"
              validation={{
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              validation={{
                required: "Image URL is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Must be a valid URL"
                }
              }}
            />
          </div>
          {!message?.type && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          )}
          {message && (
            <div
              className={`p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              {message.text}
            </div>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
} 
