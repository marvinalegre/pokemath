"use client";

import { useState } from "react";

export default function Test() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("I am a deliberate crash!");
  }

  return <button onClick={() => setShouldCrash(true)}>Trigger Error UI</button>;
}
