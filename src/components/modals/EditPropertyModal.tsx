import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';

type EditPropertyFormData = {
  price: number;
  image_url: string;
};

type EditPropertyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    price: number;
    image_url: string;
  };
};

export default function EditPropertyModal({ isOpen, onClose, property }: EditPropertyModalProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<EditPropertyFormData>({
    defaultValues: {
      price: property.price,
      image_url: property.image_url,
    },
  });

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: async (data: EditPropertyFormData) => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', property.id)
        .eq('user_id', user.user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Property updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    },
    onError: (error: Error) => {
      setMessage({ type: 'error', text: error.message });
    },
  });

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<EditPropertyFormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Edit Property'>
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
              disabled={message?.type === 'success'}
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
              disabled={message?.type === 'success'}
            />
          </div>
          {!message?.type && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update Property'}
              </Button>
            </div>
          )}
          {message && (
            <div
              className={`p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
} 
