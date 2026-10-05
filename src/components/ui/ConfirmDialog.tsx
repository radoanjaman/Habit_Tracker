import { Modal } from './Modal';
import { Button } from './Button';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-sub">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
