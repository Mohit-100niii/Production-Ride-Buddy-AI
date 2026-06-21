"use client";

import { createContext, useContext, useState } from "react";

//global memory box 
const DriverRideContext = createContext();

export const DriverRideProvider = ({ children }) => {
  const [availableRides, setAvailableRides] = useState([]);

  return (
    <DriverRideContext.Provider value={{ availableRides, setAvailableRides }}>
      {children}
    </DriverRideContext.Provider>
  );
};

export const useDriverRideContext = () => {
  return useContext(DriverRideContext);
};