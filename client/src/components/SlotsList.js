import React from "react";
import MedicamentoCard from "./MedicamentoCard";

export default function SlotsList({ slots, onRemove }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {slots.map((slot, i) => (
        <MedicamentoCard
          key={i}
          slot={slot}
          onRemove={() => onRemove(i)}
          slotIndex={i} 
        />
      ))}
    </div>
  );
}