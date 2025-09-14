import { create } from "zustand";
import { ServiceTypeType } from "../types";

type ServiceStateType = {
  selectedServiceType: ServiceTypeType | null;
  setSelectedServiceType: (serviceType: ServiceTypeType | null) => void;
};

export const useServiceTypeStore = create<ServiceStateType>((set) => ({
  selectedServiceType: null,
  setSelectedServiceType: (serviceType) => set({ selectedServiceType: serviceType }),
}));
