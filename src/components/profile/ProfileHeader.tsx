import { ChangeEvent, useRef } from 'react';
import { ChevronRight, Camera } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface Props {
  name: string;
  email: string;
  avatarUrl?: string;
  onPhotoChange?: (url: string) => void;
  onEdit: () => void;
}

export function ProfileHeader({ name, email, avatarUrl, onPhotoChange, onEdit }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (onPhotoChange) {
        onPhotoChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full items-center gap-4 rounded-card border border-line bg-card p-4 shadow-soft transition-colors duration-200 hover:border-accent/40 sm:p-6">
      <div className="relative shrink-0">
        <Avatar name={name || 'radoan'} src={avatarUrl} className="h-16 w-16 text-xl" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload photo"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface2 text-accent shadow-sm hover:bg-card hover:text-accent/80 transition-colors"
        >
          <Camera size={14} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
        />
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit name"
        className="flex min-w-0 flex-1 items-center justify-between text-left"
      >
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{name || 'radoan'}</p>
          <p className="truncate text-sm text-sub">{email || 'radoan.jaman@example.com'}</p>
        </div>
        <ChevronRight size={18} className="text-mute" aria-hidden />
      </button>
    </div>
  );
}
