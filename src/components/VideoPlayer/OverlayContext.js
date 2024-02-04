import React, { createContext, useState, useContext } from "react";

const OverlayContext = createContext();

export const useOverlays = () => {
  return useContext(OverlayContext);
};

export const OverlayProvider = ({ children }) => {
  const [overlays, setOverlays] = useState([]);

  return (
    <OverlayContext.Provider value={{ overlays, setOverlays }}>
      {children}
    </OverlayContext.Provider>
  );
};
