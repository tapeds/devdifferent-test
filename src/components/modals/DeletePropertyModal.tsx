import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';

type DeletePropertyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    price: number;
  };
};

export default function DeletePropertyModal({ isOpen, onClose, property }: DeletePropertyModalProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id)
        .eq('user_id', user.user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Property deleted successfully!' });
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Property"
      description={`Are you sure you want to delete this property (Rp. ${formatPrice(property.price)})? This action cannot be undone.`}
    >
      <div className="space-y-4">
        {!message?.type && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete Property'}
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
      </div>
    </Modal>
  );
} 
