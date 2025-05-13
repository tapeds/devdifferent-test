import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  backdropStyle?: string;
  cardClassName?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  backdropStyle = 'bg-black/50',
  cardClassName = 'w-full max-w-md',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${backdropStyle} flex items-center justify-center z-50 px-5`}>
      <div className="absolute inset-0" onClick={onClose} />
      <Card className={`${cardClassName} relative z-10`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
