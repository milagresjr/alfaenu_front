import { create } from "zustand";
import { ServiceType } from "../types";

type ServiceState = {
  selectedService: ServiceType | null;
  setSelectedService: (service: ServiceType | null) => void;
};

export const useServiceStore = create<ServiceState>((set) => ({
  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),
}));
