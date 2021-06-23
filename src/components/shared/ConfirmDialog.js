import { LefModal } from "./LefModal";
import React from "react";

export function ConfirmDialog({ onClose, ...rest }) {
  return (
    <LefModal
      {...rest}
      buttons={[
        {
          label: "Abbrechen",
          variant: "secondary",
          onClick: () => onClose(false),
        },
        { label: "Bestätigen", onClick: () => onClose(true) },
      ]}
    />
  );
}
