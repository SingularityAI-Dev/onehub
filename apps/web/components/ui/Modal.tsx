import * as React from "react"
import { cn } from "@/lib/utils"

// This is a placeholder component for a Modal.
// A full implementation would typically use a library like Radix UI's Dialog
// to handle accessibility, focus trapping, and overlays.

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, className, isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn("bg-card text-card-foreground rounded-lg p-6 shadow-lg", className)}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {children}
      </div>
    </div>
  )
}

Modal.displayName = "Modal"

export { Modal }
