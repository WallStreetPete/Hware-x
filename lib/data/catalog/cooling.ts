import type { CoolingProduct } from "../../catalog-types";

export const COOLING: CoolingProduct[] = [
  // Direct-to-chip
  { id: "vertiv-coolphase", name: "Vertiv CoolPhase Flex CDU", vendor: "vertiv", vendorName: "Vertiv", type: "Direct-to-Chip", capacityKW: 1500, fluid: "Glycol-water", released: "2024", note: "Coolant Distribution Unit for liquid-cooled racks." },
  { id: "vertiv-liebert-xdu", name: "Vertiv Liebert XDU 1350", vendor: "vertiv", vendorName: "Vertiv", type: "Direct-to-Chip", capacityKW: 1350, fluid: "PG25", released: "2024" },
  { id: "asetek-7200", name: "Asetek 7200 Cold Plate", vendor: "asetek", vendorName: "Asetek", type: "Direct-to-Chip", fluid: "PG25 / dielectric", released: "2024", note: "OEM cold plate for HPC + GPU servers." },
  { id: "coolit-chx-2000", name: "CoolIT CHx2000 CDU", vendor: "coolit", vendorName: "CoolIT", type: "Direct-to-Chip", capacityKW: 2000, fluid: "Glycol-water", released: "2024" },
  { id: "jetcool-smartplate", name: "JetCool SmartPlate", vendor: "jetcool", vendorName: "JetCool", type: "Direct-to-Chip", fluid: "Water", released: "2024", note: "Microconvective jet cooling for >1500W chips." },

  // Rear-door
  { id: "vertiv-rdhx", name: "Vertiv Liebert XDR Rear-Door HX", vendor: "vertiv", vendorName: "Vertiv", type: "Rear-Door HX", capacityKW: 80, released: "2023", note: "Air-to-liquid retrofit." },
  { id: "stulz-rdhx", name: "Stulz CyberRow RDHx", vendor: "stulz", vendorName: "Stulz", type: "Rear-Door HX", capacityKW: 60, released: "2023" },

  // Immersion (single-phase)
  { id: "submer-smartpodx", name: "Submer SmartPodX 100", vendor: "submer", vendorName: "Submer", type: "Immersion (1P)", capacityKW: 100, fluid: "SmartCoolant (synthetic)", released: "2023", note: "Single-phase immersion tank, 4U/server." },
  { id: "grc-iceraq", name: "GRC ICEraQ Series 10", vendor: "grc", vendorName: "GRC", type: "Immersion (1P)", capacityKW: 200, fluid: "ElectroSafe", released: "2024" },
  { id: "lit-on-immer", name: "LiquidStack DataTank-G2", vendor: "liquidstack", vendorName: "LiquidStack", type: "Immersion (2P)", capacityKW: 300, fluid: "Opteon 2P50 (Chemours)", released: "2024", note: "Two-phase boiling immersion." },

  // CDU + chillers
  { id: "schneider-galaxy", name: "Schneider EcoStruxure Liquid Cooling", vendor: "schneider", vendorName: "Schneider", type: "Chiller / CDU", capacityKW: 1500, released: "2024", note: "Reference design for hyperscale liquid loops." },
  { id: "stulz-cyu", name: "Stulz CyberCool 2", vendor: "stulz", vendorName: "Stulz", type: "Chiller / CDU", capacityKW: 1700, released: "2023" },

  // Evaporative
  { id: "munters-aircontroller", name: "Munters DataPak", vendor: "munters", vendorName: "Munters", type: "Evaporative", capacityKW: 600, released: "2023", note: "Indirect adiabatic; low water." },
];
