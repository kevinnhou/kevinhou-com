"use client";

import { useState } from "react";

import Terminal from "~/terminal/terminal";
import Window from "~/terminal/window";

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(true);

  function handleClose() {
    setShowTerminal(false);
  }

  function handleClick() {
    if (!showTerminal) {
      setShowTerminal(true);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      onClick={handleClick}
    >
      {showTerminal
        ? (
            <Window
              defaultHeight={450}
              defaultWidth={700}
              minHeight={300}
              minWidth={400}
              onClose={handleClose}
              title="kevinhou"
            >
              <Terminal />
            </Window>
          )
        : (
            <></>
          )}
    </div>
  );
}
