"use client";

import { useState } from "react";
import { shift } from "@/content/story";
import { ShiftGrid, type ShiftState } from "./ShiftGrid";

export function ShiftFrame() {
  const [state, setState] = useState<ShiftState>("last");
  const s = shift[state];
  return (
    <div className="shiftf">
      <div className="shiftf__copy">
        <p className="label">{shift.label}</p>
        <h2 id="shift-h" className="h-xl shiftf__h" aria-live="polite">
          <span key={state} className="swap">
            {s.headline}
          </span>
        </h2>
        <p key={`c-${state}`} className="shiftf__cap swap">
          {s.caption}
        </p>
      </div>
      <ShiftGrid onState={setState} />
    </div>
  );
}
