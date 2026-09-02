'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppointmentContextType = {
  isOpen: boolean;
  selectedService: string;
  openAppointment: (serviceName?: string) => void;
  closeAppointment: () => void;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Mecanică auto');

  const openAppointment = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsOpen(true);
  };

  const closeAppointment = () => {
    setIsOpen(false);
  };

  return (
    <AppointmentContext.Provider
      value={{
        isOpen,
        selectedService,
        openAppointment,
        closeAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
