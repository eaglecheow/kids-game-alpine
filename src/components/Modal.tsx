import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  children,
  onClose,
  label,
  wide = false,
  initialFocus,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  wide?: boolean;
  initialFocus?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    if (initialFocus) dialog?.querySelector<HTMLElement>(initialFocus)?.focus();
    return () => dialog?.close();
  }, [initialFocus]);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'wide' : ''}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="modal-close icon-button" aria-label="Close" onClick={onClose}>
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}
