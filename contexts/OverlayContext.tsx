"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OverlayContextProps {
  showOverlay: boolean;
  setShowOverlay: (showOverlay: boolean) => void;
}

const OverlayContext = createContext<OverlayContextProps>({
  showOverlay: false,
  setShowOverlay: () => {},
});

export const useOverlayContext = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <OverlayContext.Provider
      value={{
        showOverlay,
        setShowOverlay,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const { showOverlay, setShowOverlay } = useOverlayContext();
  return {
    showOverlay,
    setShowOverlay: (showOverlay: boolean) => {
      setShowOverlay(!showOverlay);
    },
  };
};
